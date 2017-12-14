import React, {Component} from "react";
import {connect} from "react-redux";
import {updateSidebarSpread, updateViewSidebar} from "../../actions/View";
import {
    addNewMarketSelector,
    deSelectMarketSelector,
    GetCategoryMasterAllCounts,
    GetCategoryParentMasterAllCounts,
    GetProductMasterAllCounts,
    GetVendorMasterAllCounts,
    emptyViewList,
    toggleHighlightedParentCategory,
    toggleHighlightedCategory,
    deleteSavedSectorData,
    getMasterTermsParentCategories
} from "../../actions/MarketSelector";
import {searchVendors, resetVendorSearch} from "../../actions/SearchSectorsActions";
import {sortAlpha} from "../../modules/helpers";


class CategoryList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selected:[],
            searchTerm:"",
            warning:false,
            items: {
                categoryParent:[],
                category:[],
                vendor: []
            },
            selectedSegments : ['parent'],
            isSectorSearchMode : false,
            isSectorSearched : false,
        };
    }

    componentDidMount() {
        if(this.props.marketSelectors.categoryParent.length==0){
            this.props.getMasterTermsParentCategories()
        }
        this.props.updateSidebarSpread(true);
    }

    componentWillUnmount() {
        this.props.resetVendorSearch();
    }

    componentWillReceiveProps(nextProps) {
        let items ={
            categoryParent:nextProps.marketSelectors.categoryParent,
            category:nextProps.marketSelectors.category,
            vendor: nextProps.marketSelectors.vendor
        }

        if(nextProps.viewListSection!==true){
            let selected =[]
            if(nextProps.selectedMarketSelectors && nextProps.selectedMarketSelectors.length>0){
                nextProps.selectedMarketSelectors.map((market)=>{
                    selected.push(market.id)
                })
            }
            this.setState({selected:selected, items:items})
        }

        if(items.category.length > 0 && !this.state.selectedSegments.includes('categories')) {
            this.toggleSegments('categories');
        }

        if(items.category.length == 0 && this.state.selectedSegments.includes('categories')) {
            this.toggleSegments('categories');
        }

        if(items.vendor.length > 0 && !this.state.selectedSegments.includes('vendors')) {
            this.toggleSegments('vendors');
        }

        if(items.vendor.length == 0 && this.state.selectedSegments.includes('vendors')) {
            this.toggleSegments('vendors');
        }
    }

    closeEvent = () => {
        this.props.updateSidebarSpread(false);
        this.props.updateViewSidebar('');
        this.props.emptyViewList()
    }

    importXLS = () => {
        this.setState({
            inputMethod: false,
        });
    }

    isSelected =(type, key) =>{
        type = (type==='categoryParent')?'parent':type
        let isSelected= false
        if(this.props.selectedMarketSelectors && this.props.selectedMarketSelectors.length>0){
            this.props.selectedMarketSelectors.map((market)=>{
                if(market.type===type && market.key===key){
                    isSelected = true;
                }
            })
        }
        return isSelected
    }

    handleHighlightSector = (sectorType, category) => {
        switch (sectorType) {
            case 'categoryParent' :
                this.deSelect('categoryParent');
                this.deSelect('category');
                this.props.toggleHighlightedParentCategory(category.key, !category.highlighted)
                break;
            case 'category' :
                this.deSelect('category');
                this.props.toggleHighlightedCategory(category.key, !category.highlighted)
                break;
        }
    }

    deSelect = (sectorType) => {
        this.state.items[sectorType].filter(sector => sector.highlighted == true).forEach(sector => {
            switch (sectorType) {
                case 'categoryParent' :
                    this.props.toggleHighlightedParentCategory(sector.key, !sector.highlighted)
                    break;
                case 'category' :
                    this.props.toggleHighlightedCategory(sector.key, !sector.highlighted)
                    break;
            }
        });
    }

    handleAddSector = (category, selectedId) => {
        const {directToFiltered, postArray, selectedMarketSelectors} = this.props
        this.setState({warning: false})

        let type = (category === 'categoryParent') ? 'parent' : category
        if (this.isSelected(category, selectedId)) {
            if(directToFiltered===undefined || directToFiltered===null){
                this.props.deSelectMarketSelector(type + '_' + selectedId)
                this.props.deleteSavedSectorData(type + '_' + selectedId);
                this.setState({
                    selected: this.state.selected.filter((se) => {
                        return (se !== (type + '_' + selectedId))
                    })
                })
            }
        } else {
            if (directToFiltered===true && selectedMarketSelectors.length === 3) {
                this.setState({warning: true})
            } else {

                if(selectedMarketSelectors.length === 3){
                    this.setState({warning: true})
                }

                this.setState({selected: [...this.state.selected, type + '_' + selectedId]})
                switch (category) {
                    case 'categoryParent' :
                        this.props.GetCategoryParentMasterAllCounts(selectedId, directToFiltered, postArray)
                        break;
                    case 'category':
                        this.props.GetCategoryMasterAllCounts(selectedId, directToFiltered, postArray)
                        break;
                    case 'vendor':
                        this.props.GetVendorMasterAllCounts(selectedId, directToFiltered, postArray)
                        break;
                    case 'product':
                        //TODO:: this is not used as products are not listed to select
                        this.props.GetProductMasterAllCounts(selectedId, directToFiltered, postArray)
                        break;
                }
            }
        }
    }

    searchItems = (e) =>{
        const query = e.target.value;
        this.setState({searchTerm: query});

        if(query.length > 3 && e.charCode == 13) {
            this.props.searchVendors(query);
            this.setState({isSectorSearched : true});
        }
    }

    enterSearchMode = (e) => {
        this.setState({
            isSectorSearchMode: true
        });
    }

    exitSearchMode = (e) => {
        this.setState({
            isSectorSearchMode: false,
            searchTerm: ''
        });

        this.props.resetVendorSearch();
    }


    renderMaxSelectedAlert(){
        if (this.state.warning === false) {
            return null;
        }
        return (
            <div className="container text-center">
                <div className="alert alert-warning">
                    You can select only up to <strong>3</strong> sectors.
                </div>
            </div>
        );
    }

    renderList = () => {
         if (this.props.viewListSection) {
             return this.props.viewList ? this.renderViewList() : null;
         } else {
             return this.state.isSectorSearchMode ? this.searchList() : this.renderAddList();
         }
    }

    renderAddList = () =>{

        let self = this
        let parentCategories = (this.state.items.categoryParent)?this.state.items.categoryParent:[];
        let categoryList = (this.state.items.category)?this.state.items.category:[]

        let vendorList =  (this.state.items.vendor)?this.state.items.vendor:[]

       return(
           <div>
               <div className={"category-set clearfix " + (!this.state.selectedSegments.includes('parent') ? 'hidden' : '') }>
                   <h3>Parent Categories</h3>
                   <div className="flex-list sectors-list">
                       {parentCategories.length > 0 &&
                       sortAlpha(parentCategories, 'key').map(function(parentCategory){

                           return  <div className={ (parentCategory.highlighted == true) ?(self.props.directToFiltered)?'flex-list-item card is-selected disabled ':'flex-list-item card is-selected ':'flex-list-item'} key={'categoryParent_'+parentCategory.key}>
                               <div onClick={() => self.handleHighlightSector('categoryParent',parentCategory)} className="flex-list-item-content">
                                   {parentCategory.key}
                               </div>
                               <button className={"add-list-btn " +  ((self.state.selected.indexOf('parent_'+parentCategory.key) !== -1) ?(self.props.directToFiltered)? "remove-disabled ":"remove":"add")}  onClick={()=>self.handleAddSector('categoryParent',parentCategory.key)}>
                               </button>
                           </div>
                       })
                       }
                   </div>

               </div>
               <div className={"category-set clearfix " + (!this.state.selectedSegments.includes('categories') ? 'hidden' : '') }>
                   <h3>Categories</h3>
                   <div className="flex-list sectors-list">
                       {categoryList.length > 0 &&
                       sortAlpha(categoryList, 'key').map(function(category){
                           return  <div className={ (category.highlighted == true) ? (self.props.directToFiltered)?'flex-list-item card is-selected disabled ':'flex-list-item card is-selected ':'flex-list-item'} key={'category_'+category.key}>

                               <div onClick={() => self.handleHighlightSector('category',category)} className="flex-list-item-content">
                                   {category.key}
                               </div>


                               <button className={"add-list-btn " + ((self.state.selected.indexOf('category_'+category.key) !== -1) ?(self.props.directToFiltered)? "remove-disabled":"remove ":"add")} onClick={()=>self.handleAddSector('category',category.key)}>
                               </button>
                           </div>
                       })
                       }
                   </div>

               </div>
               <div className={"category-set clearfix " + (!this.state.selectedSegments.includes('vendors') ? 'hidden' : '') }>
                   <h3>Vendors ({vendorList.length}) </h3>
                   <div className="flex-list sectors-list vendor-list">
                       {vendorList.length > 0 &&
                       sortAlpha(vendorList, 'key').map(function(vendor){
                           return  <div className={(self.props.directToFiltered)?'flex-list-item card is-selected disabled ':'flex-list-item'} key={'vendor_'+vendor.key}>
                               <div className="flex-list-item-content">
                                   {vendor.key}
                               </div>
                               <button className= {"add-list-btn " + ((self.state.selected.indexOf('vendor_'+vendor.key) !== -1) ?(self.props.directToFiltered)? 'remove-disabled':'remove ':'add')}  onClick={()=>self.handleAddSector('vendor',vendor.key)}>

                               </button>
                           </div>
                       })
                       }
                   </div>
               </div>
           </div>
       )
    }

    getNoResultsText = () => {
        if(this.state.isSectorSearched && this.state.searchTerm.length) {
            this.setState({isSectorSearched : false});
            return (
                <p>{`No result found for "${this.state.searchTerm}"`}</p>
            )
        }

        return '';
    }

    searchList = () =>{
        const parentCategories = this.props.searchResults.categoryParent;
        const categoryList = this.props.searchResults.category;
        const vendorList =  this.props.searchResults.vendor;
        const message =  this.props.searchResults.message;

        if(!(parentCategories.length && categoryList && vendorList)) {
            return (
                <p>
                    { message }
                </p>
            )
        }

        return (
            <div>
                { vendorList.length > 0 &&
                <div className={"category-set clearfix "}>
                    <h3>Vendors</h3>
                    <div className="flex-list sectors-list vendor-list">
                        {sortAlpha(vendorList, 'key').map((vendor) => {
                            return  <div className={(this.props.directToFiltered)?'flex-list-item card is-selected disabled ':'flex-list-item'} key={'vendor_'+vendor.key}>
                                <div className="flex-list-item-content">
                                    {vendor.key}
                                </div>
                                <button className= {"add-list-btn " + ((this.state.selected.indexOf('vendor_'+vendor.key) !== -1) ?(this.props.directToFiltered)? 'remove-disabled':'remove ':'add')}  onClick={()=>this.handleAddSector('vendor',vendor.key)}>

                                </button>
                            </div>
                        })}
                    </div>
                </div> }

                { categoryList.length > 0 &&
                <div className={"category-set clearfix"}>
                    <h3>Categories</h3>
                    <div className="flex-list sectors-list vendor-list">
                        {sortAlpha(categoryList, 'key').map((category) => {
                            return  <div className={(this.props.directToFiltered)?'flex-list-item card is-selected disabled ':'flex-list-item'} key={'category_'+category.key}>

                                <div className="flex-list-item-content">
                                    {category.key}
                                </div>


                                <button className={"add-list-btn " + ((this.state.selected.indexOf('category_'+category.key) !== -1) ?(this.props.directToFiltered)? "remove-disabled":"remove ":"add")} onClick={()=>this.handleAddSector('category',category.key)}>
                                </button>
                            </div>
                        })}
                    </div>
                </div> }

                { parentCategories.length > 0 &&
                <div className={"category-set clearfix"}>
                    <h3>Parent Categories</h3>
                    <div className="flex-list sectors-list vendor-list">
                        {sortAlpha(parentCategories, 'key').map((parentCategory) =>{

                            return  <div className={(this.props.directToFiltered)?'flex-list-item card is-selected disabled ':'flex-list-item'} key={'categoryParent_'+parentCategory.key}>
                                <div onClick={() => this.handleHighlightSector('categoryParent',parentCategory)} className="flex-list-item-content">
                                    {parentCategory.key}
                                </div>
                                <button className={"add-list-btn " +  ((this.state.selected.indexOf('parent_'+parentCategory.key) !== -1) ?(this.props.directToFiltered)? "remove-disabled ":"remove":"add")}  onClick={()=>this.handleAddSector('categoryParent',parentCategory.key)}>
                                </button>
                            </div>
                        })}
                    </div>
                </div> }
            </div>
        )
    }

    renderViewList =()=>{
        let ListOne=[]
        let ListOneName =''
        let ListTwo=[]
        let ListTwoName =''


        if((this.props.viewList.type==='parent')){
            ListOne = this.props.viewList.categoryList
            ListOneName ='Categories'
            ListTwo = this.props.viewList.vendorList
            ListTwoName ='Vendors'
        }
        else if((this.props.viewList.type==='category')){
            ListOne = this.props.viewList.vendorList
            ListOneName ='Vendors'

            ListTwo = this.props.viewList.productList
            ListTwoName ='Products'
        }
        else{
            ListOne = this.props.viewList.productList
            ListOneName ='Products'
        }



        return (
            <div>
                <div className="category-set clearfix">
                    <h3>{ListOneName} ({ListOne.length})</h3>
                    <div className="flex-list">
                        {ListOne.length > 0 &&
                        sortAlpha(ListOne, 'key').map(function(item){

                            return  <div className='flex-list-item view-only card selected'
                                         key={'listOne_'+item.key}>
                                <div className="flex-list-item-content">
                                    {item.key}
                                </div>
                            </div>
                        })
                        }
                    </div>

                </div>
                {(ListTwoName!=='')?
                    <div className="category-set clearfix">
                        <h3>{ListTwoName} ({ListTwo.length})</h3>
                        <div className="flex-list">
                            {ListTwo.length > 0 &&
                            sortAlpha(ListTwo, 'key').map(function(item){

                                return  <div className='flex-list-item view-only card selected'
                                             key={'listTwo_'+item.key}>
                                    <div className="flex-list-item-content">
                                        {item.key}
                                    </div>
                                </div>
                            })
                            }
                        </div>

                    </div>
                    :null}

            </div>
        )
    }

    toggleSegments = (type) => {
        let selectedSegments = this.state.selectedSegments;
        const isSelected = selectedSegments.includes(type);

        if(!(selectedSegments.length == 1 && isSelected)) {
            if(isSelected) {
                selectedSegments.splice(selectedSegments.indexOf(type), 1);
            } else {
                selectedSegments = selectedSegments.concat(type);
            }

            this.setState({
                selectedSegments
            });
        }

        return false;
    }

    getSidebarTitle = () => {
        return (this.props.viewListSection ) ? (this.props.viewList)?this.props.viewList.key:'':'Add Sectors';
    }

    getSidebarTitle = () => {
        if(this.props.viewListSection) {
            return this.props.viewList ? this.props.viewList.key : '';
        } else if (this.state.isSectorSearchMode) {
            return 'Search Sectors';
        } else {
            return 'Add Sectors';
        }
    }


    render() {

        return (
            <div className="sidebar sidebar-lg">
                {this.props.spread && (
                    <div className="sidebarwrapper">
                        <div className="sidebarfade"/>
                        <div className="sidebarcontent">
                            <div className="sidebarcontet-innerwrapper">
                            <div className="close-button">
                                <img onClick={this.closeEvent} className="sidebar-close-icon"
                                     src="./static/images/close-icon.png" alt=""/>
                            </div>
                            <div className="add-customer">

                                <div className="sidebar-header clearfix">
                                    <div className="sidebar-title">
                                        { this.getSidebarTitle() }
                                    </div>
                                    {(this.props.viewListSection)?null: <div className="sidebar-actions">
                                        <div className="search-bar">
                                            <div className="search-box">
                                                <input onChange={this.searchItems} className="search-input"
                                                       onFocus={this.enterSearchMode}
                                                       onKeyPress={this.searchItems}
                                                       type="text" placeholder="Type to Search Vendors"
                                                       value={this.state.searchTerm}
                                                       />
                                            </div>
                                                {
                                                    this.state.isSectorSearchMode &&
                                                    <button onClick={this.exitSearchMode}
                                                            title="Exit Search Mode">Exit Search Mode</button>
                                                }
                                        </div>
                                    </div>}
                                </div>
                                {(this.props.viewListSection) ? null :
                                    !this.state.isSectorSearchMode && <div className="filter-vendors-tiles">
                                        <button
                                            className={this.state.selectedSegments.includes('parent') ? 'active filter-vendor-tile' : 'filter-vendor-tile'}
                                            onClick={() => {
                                                this.toggleSegments('parent')
                                            }}>Parent Categories
                                        </button>
                                        <button
                                            className={this.state.selectedSegments.includes('categories') ? 'active filter-vendor-tile' : 'filter-vendor-tile'}
                                            onClick={() => {
                                                this.toggleSegments('categories')
                                            }}>Categories
                                        </button>
                                        <button
                                            className={this.state.selectedSegments.includes('vendors') ? 'active filter-vendor-tile' : 'filter-vendor-tile'}
                                            onClick={() => {
                                                this.toggleSegments('vendors')
                                            }}>Vendors
                                        </button>
                                    </div>
                                }

                                {(this.props.requesting)?<div className="preloader"></div>:null}

                                {this.renderMaxSelectedAlert()}


                                {(this.state.warning!=='')?<span>{this.state.warning}</span>:null}

                                { this.renderList() }
                            </div>


                        </div>
                        </div>
                    </div>
                )}
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        spread: state.view.spread,
        marketSelectors: state.selectorsFromApi,
        selectedMarketSelectors:state.mySectors.list,
        highlightedMarketSelectors:state.selectedSegment.highlightedMarketSelectors,
        viewList: state.mySectors.selectedSector,
        requesting: state.mySectors.requesting,
        searchResults : state.SearchSectors
    };
}

export default connect(mapStateToProps, {
    deSelectMarketSelector,
    updateSidebarSpread,
    updateViewSidebar,
    addNewMarketSelector,
    GetCategoryParentMasterAllCounts,
    GetCategoryMasterAllCounts,
    GetProductMasterAllCounts,
    GetVendorMasterAllCounts,
    emptyViewList,
    toggleHighlightedParentCategory,
    toggleHighlightedCategory,
    deleteSavedSectorData,
    searchVendors,
    resetVendorSearch,
    getMasterTermsParentCategories
})(CategoryList);
