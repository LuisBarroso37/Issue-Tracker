/*
*
*
*       Complete the API routing below
*
*
*/

'use strict';

const expect = require('chai').expect;
const MongoClient = require('mongodb');
const ObjectId = require('mongodb').ObjectID;
let issueModel = require('../models/issue.model');

module.exports = app => {

  app.route('/api/issues/:project')
    
//User story 6 - I can GET /api/issues/{projectname} for an array of all issues on that specific project with all the information for each issue as was returned when posted.
    .get((req, res) => {
      let project = req.params.project;
      let { _id, issue_title, issue_text, created_by, assigned_to, status_text, created_on, open } = req.query;

        issueModel.find()
        .then(doc => {
          
// User story 7 - I can filter my get request by also passing along any field and value in the query(ie. /api/issues/{project}?open=false). 
// I can pass along as many fields/values as I want.
          if (_id) {
            doc = doc.filter(issue => issue._id == _id);
          }
          
          if (issue_title) {
            doc = doc.filter(issue => issue.issue_title == issue_title);
          }
          
          if (issue_text) {
            doc = doc.filter(issue => issue.issue_text == issue_text);
          }
          
          if (created_by) {
            doc = doc.filter(issue => issue.created_by == created_by);
          }
          
          if (assigned_to) {
            doc = doc.filter(issue => issue.assigned_to == assigned_to);
          }
          
          if (status_text) {
            doc = doc.filter(issue => issue.status_text == status_text);
          }
          
          if (created_on) {
            doc = doc.filter(issue => issue.created_on == created_on);
          }
          
          if (open) {
            open = (open == "false") ? false : true;
            doc = doc.filter(issue => issue.open == open);
          }
          
          res.json(doc);
        })
        .catch(err => {
          res.json('Error: ' + err);
        })
    })
    
// User story 2 - I can POST /api/issues/{projectname} with form data containing required issue_title, issue_text, created_by, and optional assigned_to and status_text.
    .post( async (req, res) => {
      let project = req.params.project;
      const { issue_title, issue_text, created_by, assigned_to, status_text } = req.body;
      
// User story 3 - The object saved (and returned) will include all of those fields (blank for optional no input) and also include created_on(date/time), updated_on(date/time),
// open(boolean, true for open, false for closed), and _id.
      try {
          let Issue = new issueModel({
            issue_title,
            issue_text,
            created_by,
            assigned_to,
            status_text,
            created_on: new Date(),
            updated_on: new Date(),
            open: true
          })
          
          let issue = await Issue.save();
          
          res.send(issue);
        
        } catch (err) {
          console.error(err);
          res.status(500).send('Missing required fields');
        }
      })
    
// User story 4 - I can PUT /api/issues/{projectname} with a _id and any fields in the object with a value to object said object.
// Returned will be 'successfully updated' or 'could not update '+_id. This should always update updated_on. If no fields are sent return 'no updated field sent'.
    .put(async (req, res) => {
      let project = req.params.project;
      const {_id, issue_title, issue_text, created_by, assigned_to, status_text, open} = req.body;
      
      delete req.body._id;
      let update = req.body;
    
      for (let key in update) {
        if (update[key] == '') {
          delete update[key];
        }
      }
      
      if (Object.keys(update).length == 0) {
        return res.send('No updated fields sent');
      } else {
        update = {...update, updated_on: new Date()};
      }
    
      try { 
        let issue = await issueModel.findOneAndUpdate({_id}, {$set: update}, {new: true, useFindAndModify: false});
          
        res.send('Successfully updated');
      
      } catch (err) {
        console.error(err);
        res.send('Could not update - ' + _id);
      }
    })
    
// User story 5 - I can DELETE /api/issues/{projectname} with a _id to completely delete an issue. 
// If no _id is sent return '_id error', success: 'deleted '+_id, failed: 'could not delete '+_id.
    .delete((req, res) => {
      let project = req.params.project;
      let _id = req.body._id;
    
      if (!_id) {
        return res.send('_id error');
      } else {
        issueModel.findOneAndRemove({_id})
        .then(doc => {
          res.send('Deleted - ' + _id);
        })
        .catch(err => {
          res.send('Could not delete - ' + _id);
        })
      }
    });
    
};
