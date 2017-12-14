export const sortAlpha = (data, key) => {
    return data.sort((a, b) => {
        const value1 = a[key].toLowerCase(), value2=b[key].toLowerCase();

        if (value1 < value2)
            return -1;
        if (value1 > value2)
            return 1;
        return 0;
    })
}

export const loadState = () => {
    try {
        const serializedState = localStorage.getItem('state');
        if(serializedState == null) {
            return undefined;
        }
        return JSON.parse(serializedState);
    } catch (err) {
        return undefined;
    }
}

export const saveState = (state) => {
    try {
        const serializedState = JSON.stringify(state);
        localStorage.setItem('state', serializedState);
    } catch (err) {

    }
}

export const createFilteredPostArray = (filteredItem, masterFilter = []) => {
    let postArray = [
        {
            fieldName: (filteredItem.type === 'parent') ? "categoryParent" : filteredItem.type,
            fieldValues: [filteredItem.key]
        }
    ]

    const categoryList = (filteredItem.type === 'category') ? filteredItem.vendorList : filteredItem.categoryList


    let fieldName = (filteredItem.type === 'category') ? 'vendor' : 'category'
    let fieldName2 = (filteredItem.type === 'parent') ? 'vendor' : 'product'
    let fieldValuesArray = []
    let fieldValuesArray2 = []

    let postFiledOne=true;
    let postFiledTwo = true;

    if(categoryList.length) {
        categoryList.map((cat) => {
            if (!cat.unSelected) {
                fieldValuesArray.push(cat.key)

                //get list from only selected parent item

                if (cat.list && cat.list.length) {
                    cat.list.map((cat2) => {
                        if (!cat2.unSelected) {
                            fieldValuesArray2.push(cat2.key)
                        }
                    })
                }else{
                    postFiledTwo = false
                }
            }

        })
    }else{
        postFiledOne = false
    }

    if (postFiledOne) {
        postArray.push({
            fieldName: fieldName, fieldValues: fieldValuesArray
        })
    }

    if (postFiledTwo) {
        postArray.push({
            fieldName: fieldName2, fieldValues: fieldValuesArray2
        })
    }


    if (masterFilter.length > 0) {
        masterFilter.map((item) => {
            postArray.push({
                fieldName: item.fieldName, fieldValues: item.fieldValues
            })
        })
    }

    return postArray;
}