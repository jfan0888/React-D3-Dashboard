import {combineReducers} from "redux";

import ViewReducer from "./ViewReducer";
import SelectedSegmentReducer from "./SelectedSegmentReducer";
import SelectedMarketSelectorReducer from "./SelectedMarketSelectorReducer";
import CustomerReducer from "./CustomerReducer";
import MasterDataReducer from "./MasterDataReducer";
import ChartReducer from "./ChartReducer";
import MarketSelectorsReducer from "./MarketSelectorsReducer";
import MySectors from "./MySectorsReducer";
import MySavedSegments from "./SavedSegmentReducer";
import SearchSectors from "./SearchSectorsReducer";

const rootReducer = combineReducers({
    view: ViewReducer,
    selectedSegment: SelectedSegmentReducer,
    selectedMarketSelectors: SelectedMarketSelectorReducer,
    myCustomers: CustomerReducer,
    masterData: MasterDataReducer,
    chartReducer: ChartReducer,
    selectorsFromApi: MarketSelectorsReducer,
    mySectors: MySectors,
    mySavedSegments: MySavedSegments,
    SearchSectors
});

export default rootReducer;
