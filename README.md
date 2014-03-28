README
===
##Setup and Dependencies
Author: <a href=mailto:dparker.tech@gmail.com>Daniel Parker</a>

###Dependencies
1. Install nginx, nodejs, ruby and ruby-compass
    ```
    sudo apt-get install <package-name>
    ```

2. Install nodejs libraries: karma-jasmine, connect-modrewrite, grunt-cli, and yeoman
    ```
    sudo npm install -g <package-name>
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

    2. Find the line ```root /usr/share/nginx/html;``` and replace it with ```root         /usr/share/nginx/html/dist;```
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
5. Install Bower Dependencies
    ```
    bower install
    ```

6. Install project dependencies
    ```
    npm install
    ```
    If this step fails then delete the ```node_modules``` directory in the project root and execute the above         command again

7. Build the web application
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

##Branch Naming Standard
Author: <a href=mailto:zakwak01@gmail.com>Zakariah Chitty</a>

## Code Review Process
This standard for branch naming is intended to improve the clarity of the purpose of branches. All development team members must follow this standard and ensure that the standard is followed at all times.

### Branch Clasification
A branch can come in one of three flavours as shown below: 

Clasification:   Description:
*feat            Feature being added or expanded
*bug             Major bug fixing. 
*junk            Throwaway branch created to experiment or spike

Rules
*Typcally bug branches should only be used in circumstances where the original feature branch has already been merged to master and it would be impractical to revive it. Other instances may be where a group of small unrelated bugs need to be addressed. 
*Junk branches should not get merged to master as they are experimental. The code in these branches are really only there to document experimentation and to facilitate a way of getting feedback on said experiments(or spikes).

### Basic Name Structure
The full branch name should consist of two parts. The branch clasification and the descriptive title. The two form the full branch name as seen bellow:

branch-clasification/Descriptive-Title

Rules:
* The descriptive title should be camel cased with each word seperated by a '-'.
* The branch clasification should be written in all lowercase and followed by a '/'.
* Issue codes and all number strings are not valid descriptive titles!
* The descriptive title should try and be descriptive and not simply a rewording of an existing or an inactive branch. In such a case where a previouse feature is being enhanced, that old branch should be revived if possible.If this is not possible simply append the phrase the name in terms of an enhancement. The forming of descriptive names is somewhat subjective so this rule should be considered more of a guideline. 

#### Examples:
```
feat/Feature-X
junk/W2ui-Panel-Layouts
```

For more information on branch naming see:
http://stackoverflow.com/questions/273695/git-branch-naming-best-practices








