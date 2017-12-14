import {
    CP_ADD_MARKET_SELECTOR_CAT,
    CP_ADD_MARKET_SELECTOR_PARENT_CAT,
    CP_ADD_MARKET_SELECTOR_PRODUCT,
    CP_ADD_MARKET_SELECTOR_VENDOR,
    CP_TOGGLE_MARKET_SELECTOR_CAT,
    CP_TOGGLE_MARKET_SELECTOR_PARENT_CAT
} from "../actions/MarketSelector";

import {uniqBy} from 'lodash';

const InitialState = {
    categoryParent: [],
    category: [],
    vendor: [],
    product: [],

}

export default function (state = InitialState, action) {
    switch (action.type) {

        case CP_ADD_MARKET_SELECTOR_PARENT_CAT:
            return {...state,  categoryParent: action.payload}
        case CP_TOGGLE_MARKET_SELECTOR_PARENT_CAT:
            const newParentCategoryState = {
                ...state,
                    categoryParent: state.categoryParent.map((category) => {
                        if(category.key == action.payload) {
                            category.highlighted = !category.highlighted;
                        }
                        return category;
                    })
            };
            return {
                ...newParentCategoryState,
                    category : newParentCategoryState.category.filter((category) => {
                        return newParentCategoryState.categoryParent.filter((categoryParent) => {
                            return categoryParent.key == category.parent && categoryParent.highlighted == true;
                        }).length > 0;
                    })
            };
        case CP_TOGGLE_MARKET_SELECTOR_CAT:
            const newCategoryState = {
                ...state,
                    category: state.category.map((category) => {
                        if(category.key == action.payload) {
                            category.highlighted = !category.highlighted;
                        }
                        return category;
                    })
            };

            return {
                ...newCategoryState,
                    vendor : newCategoryState.vendor.filter((vendor) => {
                        return newCategoryState.categoryParent.filter((category) => {
                            return category.key == vendor.parent && category.highlighted == true;
                        }).length > 0;
                    })

            };
        case CP_ADD_MARKET_SELECTOR_CAT:
            return {
                ...state,
                    category: uniqBy(state.category.concat(action.payload), elem => elem.key)
            }
        case CP_ADD_MARKET_SELECTOR_VENDOR:
            return {
                ...state,
                    vendor: uniqBy(state.vendor.concat(action.payload), elem => elem.key)
            }
        case CP_ADD_MARKET_SELECTOR_PRODUCT:
            return {...state, product: action.payload}




        default:
            break;
    }

    return state;
}
