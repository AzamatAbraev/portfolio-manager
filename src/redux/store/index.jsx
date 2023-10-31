import { configureStore } from "@reduxjs/toolkit";
import PropTypes from "prop-types";
import { Provider } from "react-redux";
import authReducer, { authName } from "../slices/auth";
import skillReducer, { skillName } from "../slices/skills";
import educationReducer, { educationName } from "../slices/education";
import portfolioQuery, { portfolioName, portfolioReducer } from "../queries/portfolio";
import experienceQuery, { experienceName, experienceReducer } from "../queries/experience";
import usersQuery, { usersName, usersReducer } from "../queries/users";
import messageQuery, { messagesName, messagesReducer } from "../queries/messages";
import authQuery, { authAccountName, authAccountReducer } from "../queries/auth";

const reducer = {
  [authName]: authReducer,
  [skillName]: skillReducer,
  [educationName]: educationReducer,
  [portfolioName]: portfolioReducer,
  [experienceName]: experienceReducer,
  [usersName]: usersReducer,
  [messagesName]: messagesReducer,
  [authAccountName]: authAccountReducer,
};

const store = configureStore({
  reducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat([portfolioQuery.middleware, experienceQuery.middleware, usersQuery.middleware, messageQuery.middleware, authQuery.middleware]),
});

const StoreProvider = ({ children }) => {
  return <Provider store={store}>{children}</Provider>;
};

StoreProvider.propTypes = {
  children: PropTypes.node,
};

export default StoreProvider;
