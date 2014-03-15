README
===
## Code Review Process
This standard for code review is intended to improve both source code quality and also the cross-developer awareness. All development team members must follow this code review process and ensure that the process is followed at all times.

### Roles:
* Author - Person that wrote the code to be reviewed
* Reviewer - Person/s that will review the code written by the ‘author’
* Moderator - Person that is ensuring the code review process is being followed

### Process:
* The ‘author’ writes code in a feature branch and completes their own testing and review before pushing individual commits to that branch.
* When the ‘author’ has completed/improved/updated a feature they prepare an issue as per the Review Document template in the corresponding github repository. That review document issue is tagged as ‘Review Document’ and assigned to the ‘author’. All other developers are automatically notified by github on creation of the issue.
* Another team member chooses to act as the ‘reviewer’ for an issue labeled as ‘Review Document’. The ‘reviewer’ notifies the team by creating a comment on in the review document with the content “Reviewing”. Note - the moderator is the last person not assigned to a role.
* The ‘author’ organises a review meeting with the ‘reviewer’.
* The review meeting is held and all code defects noted and added to the review document as a single listed comment. The location of the defects (ie. file and line number) should be clearly visible.
* The ‘author’ fixes the defects found in the code review meeting and notifies by commenting with “Defects fixed - (commit number)” in the ‘Review Document’. The ‘author’ must also tag the final commit with the issue number on github eg. ```“Review - 12345”```.
* The ‘author’ notifies the moderator (not the reviewer) that the defects have been fixed by creating a pull request from the feature branch to ‘master’ and assigning it to the moderator.
* The ‘moderator’ confirms that all defects were fixed and marks the review document issue as resolved as well as accepting the pull request and merging the branches. 


### ‘Review Document’ Template
```
Author: <Developer Name> - <Developer Username>

Summary: <Summary of feature / changes to feature. ~ 2 Paragraphs>

Commits: <List of commits to review copied from ‘git log --pretty=oneline --abbrev-commit abcdefg..’ including the trailing dots to list all commits since abcdefg, or alternatively ‘git log --pretty=oneline --abbrev-commit abcdefg..hijklmnop’ for the log between two commits>
```

#### Example:
```
Author: Daniel Parker - rlgod

Summary: Implemented feature ‘A’ to satisfy the following requirements…
         etc.
Commits: 
      67898aa remove strict against null test
b8c028e Merge pull request #141 from Rovak/grunt/watchtask
81920bd moved building source to separate task to speed up build cycles
01110ec trigger build when source changes
32b973f added grunt-contrib-watch dependency
516f7dd jshint warnings
09573e1 trailing spaces
```
