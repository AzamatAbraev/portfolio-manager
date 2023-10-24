import { configureStore } from "@reduxjs/toolkit";
import PropTypes from "prop-types"
import { Provider } from "react-redux";
import authReducer, { authName } from "../slices/auth";
import skillReducer, { skillName } from "../slices/skills";
import educationReducer, { educationName } from "../slices/education";

const reducer = {
  [authName]: authReducer,
  [skillName]: skillReducer,
  [educationName]: educationReducer,
}

const store = configureStore({reducer})

const StoreProvider = ({children}) => {
  return <Provider store={store}>{children}</Provider>;
};

StoreProvider.propTypes = {
  children: PropTypes.node,
}

export default StoreProvider