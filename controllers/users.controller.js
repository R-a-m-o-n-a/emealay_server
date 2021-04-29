/**
 * This file contains all communication to Auth0's database
 */
import { ManagementClient } from 'auth0';
import dotenv from 'dotenv';
import { deleteSettingOfUser } from "./settings.controller.js";
import { deleteAllMealsOfUser } from "./meals.controllers.js";
import { deleteAllPlansOfUser } from "./plans.controller.js";

dotenv.config();

const authConfig = {
  domain: process.env.AUTH0_DOMAIN,
  audience: process.env.AUTH0_AUDIENCE,
  clientId: process.env.AUTH0_CLIENT_ID,
  clientSecret: process.env.AUTH0_CLIENT_SECRET,
};

let managementAPI = new ManagementClient({
  domain: authConfig.domain,
  clientId: authConfig.clientId,
  clientSecret: authConfig.clientSecret
});

export const getAllUsers = async (req, res) => {
  managementAPI.getUsers()
               .then(function (users) {
                 res.status(200).json(users);
               })
               .catch(function (err) {
                 console.log('error when finding users', err);
                 res.status(404).json({ message: error.message });
               });
}

export const getUsersFromQuery = async (req, res) => {
  let query = req.params.query;
  console.log(query);
  let wildcardQuery = query;
  if (wildcardQuery.length >= 3) wildcardQuery = '*' + query; // add wildcard to the front (needs at least 3 characters)
  wildcardQuery += '*'; // add wildcard to back, for query options see https://auth0.com/docs/users/user-search/user-search-query-syntax
  /** metadata fields, like nickname, do not support wildcards yet. The nickname gets copied to the "normal" nickname field (and thus found als with wildcards),
   * only if the user is not logged in via OAuth. In that case, nicknames are invariable as they are set through the external Provider (like Google). */

  const capitalizedQuery = query.charAt(0).toUpperCase() + query.slice(1);
  console.log(capitalizedQuery);
  const params = {
    q: 'name:' + wildcardQuery + ' OR nickname:' + wildcardQuery + ' OR user_metadata.nickname:' + query + ' OR user_metadata.nickname:' + capitalizedQuery,
  };
  console.log(params);
  managementAPI.getUsers(params)
               .then(function (users) {
                 res.status(200).json(users);
               })
               .catch(function (err) {
                 console.log('error when finding users', err);
                 res.status(404).json({ message: err.message });
               });
}

export const getUserById = async (req, res) => {
  let userId = req.params.id;

  managementAPI.getUser({ id: userId })
               .then(function (user) {
                 res.status(200).json(user);
               })
               .catch(function (err) {
                 console.log('error when finding user', err);
                 res.status(404).json({ message: err.message });
               });

}

export const updateUserMetadata = async (req, res) => {
  const newMetadata = req.body;
  const userId = req.params.id;
  const params = { id: userId };

  managementAPI.updateUserMetadata(params, newMetadata)
               .then(function (user) {
                 // console.log('user metadata updated.', user);
                 res.status(200).json(user);
               })
               .catch(function (err) {
                 // console.log('error while updating user metadata', err);
                 res.status(404).json({ message: err.message });
               });
}

export const updateUser = async (req, res) => {
  const newData = req.body;
  const userId = req.params.id;
  const params = { id: userId };

  managementAPI.updateUser(params, newData)
               .then(function (user) {
                 // console.log('user updated.', user);
                 res.status(200).json(user);
               })
               .catch(function (err) {
                 // console.log('error while updating user', err);
                 res.status(404).json({ message: err.message });
               });
}

export const deleteUser = async (req, res) => {
  const userId = req.params.id;
  const params = { id: userId };

  await deleteSettingOfUser(userId);
  await deleteAllPlansOfUser(userId);
  await deleteAllMealsOfUser(userId);

  managementAPI.deleteUser(params)
               .then(function () {
                 console.log('user deleted for good.');
                 res.status(200).json('account deleted');
               })
               .catch(function (err) {
                 console.log('error while deleting user', err);
                 res.status(404).json({ message: err.message });
               });
}
