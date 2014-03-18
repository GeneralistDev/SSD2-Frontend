README
===
##Setup and Dependencies
Author: <a href=mailto:dparker.tech@gmail.com>Daniel Parker</a>

###Dependencies
1. Install nginx, nodejs, ruby and compass
```
sudo apt-get install <package-name>
```
2. Install nodejs libraries: karma-jasmine, connect-modrewrite, grunt-ui, and yeoman
```
sudo npm install -g <package-name>
```
3. Install Bower
```
bower install
```

###Setup and Configuration
1.  Configure nginx directory ownership and group. (Replace &lt;username> with your linux username)
```
sudo chgrp -R www-data /usr/share/nginx/html
```
```
sudo chown -R <username> /usr/share/nginx/html
```
2. Fix the nginx web root and enable single page websites
    1. Open the default nginx site configuration
    ```
    gksu gedit /etc/nginx/sites-available/default
    ```
    2. Find the line ```root /usr/share/nginx/html;``` and replace it with ```root /usr/share/nginx/html/dist;```
    3. Find the line ```try_files $uri $uri/ /index.html;``` and replace it with ```try_files $uri /index.html;```
    4. Save the file and exit gedit.
    5. Restart nginx
    ```
    sudo service nginx restart
    ```
3. *Optional but recommended: Create a symbolic link to the nginx web root in your documents
```
ln -s /usr/share/nginx/html ~/Documents/html
```
4. Pull the SSD2-Frontend repository to the html root
```
cd ~/Documents/html && git init && git remote add origin https://github.com/rlgod/SSD2-Frontend.git && git pull origin master
```
5. Build the web application
```
grunt build
```

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
