# AssignForce - A scheduling application

###### About the codebase ######

There are two main branches: **master** and **development**.  As a developer, you're not allowed to touch either of them directly.
The **master** branch is the copy of the application that's running on the production server
The **development** branch is the copy of the application that's running on the development server
When you'd like to work on a feature, make a feature branch, and create a Pull Request (a request to merge) to the development branch.
After you feel your work is satisfactory, comment `RFI` on your Pull Request, and your team lead will review your code, and, if accepted, it will be merged onto the development branch.
On every merge to development, it is important that all developers pull the latest version of the development branch to ensure everyone's working on the same codebase.
Periodically, work on the development branch will be merged to the master branch.


###### How to Set Up your Environment ######

1. Make sure *Maven* is installed and accessible my the `mvn` command on Git Bash or Windows CommandLine
2. Make sure your *JAVA_HOME* environmental variable is set to something like *C:\Program Files\Java\jdk1.8.0_101*
3. Create a GitHub account, and direct message Chris with your GitHub username
4. Set up the environmental variables as described in Slack

5. Clone this project on your local machine (run `git clone https://github.com/revaturelabs/assignforce.git` )
6. Open an instance of Git Bash in the *Jars* folder and run this command: `mvn install:install-file -Dfile=ojdbc7.jar -DgroupId=com.oracle -DartifactId=ojdbc7 -Dversion=12.1.0.1 -Dpackaging=jar`
7. Download and use [Spring Tool Suite](https://spring.io/tools/sts/all) for the development of this application
8. In Spring Tool Suite, select `File->Import...`
  * In the `General` folder, select `Projects from Folders or Archive`.
  * Select the folder of the repo you just copied
  * Finish the operation, and allow Maven to do an initial build of the project

9. At this point, you should be able to run the project as a Spring Boot App and access the project on your browser at `http://localhost`
  * NOTE: If you want to override the default port, set the environment variable `SERVER_PORT` to whatever port you desire, and you update the relevant environment variables (EG: use `http://localhost:8080` rather than `http://localhost`)
10. Create a feature branch and pull request for the issue you're working, such as `AwesomeFeature`. To do this:
  * On Git Bash, use `git checkout development` to make sure you're on the development branch
  * Run `git pull` to pull the latest code
  * Use `git checkout -b AwesomeFeature` to create a local branch for your user-story
  * Make a small change to your feature branch and commit it One option for doing this is to touch a dummy file, to do that, follow these steps:
    i. Run `touch dummy.txt`
    ii. Run `git add dummy.txt`
    iii. Run `git commit -am "added dummy"`
  * Type `git push --set-upstream origin AwesomeFeature` to create the branch remotely (For subsequent pushes, you can simply use `git push`)
  * If you created a dummy file, revert it with the following steps:
    i. `git rm dummy.txt`
    ii. `git commit -am "removed dummy file"`
    iii. `git push`
  * On GitHub, you should see a box near the top saying that you recently pushed to it, and you'll see a button labeled *Compare & pull request* .
  * Click that, give your pull request the same name as your branch, and continue working. Each commit will run a feature test

11. To access the database, use [SQL Developer](http://www.oracle.com/technetwork/developer-tools/sql-developer/downloads/index.html).
  * Create a new connection with the username and password you found in the Slack information (check the *Save Password* box for your convienance)
  * for the URL, take the URL that you found in the Slack information, and omit `jdbc:oracle:thin:@` at the beginning and `:1521:ORCL` at the end
  * Use port `1521`
  * Use the SID `ORCL`
  * Test the connection
  * If it works, save it and connect to it



###### I haven't used Git Bash in a long while! How do I... ######

* ... generally use it? After you've cloned as above and created your branch, the general flow is:
  1. Before you start working, run a `git pull` to make sure you have the most up to date code (especially if there are other people on the same branch as you)
  2. Work on your stuff
  3. Before you're ready to push, run a `git pull` and deal with any merge conflicts
  4. Add files by running `git add [files you created]`
  5. Commit your changes by running `git commit -am "[message about what you did]"`
  6. Push your changes by running `git push` (use `git push --set-upstream origin [branch name]` if it's your first time pushing to the branch)
* ... stop it from asking me for my password every time I push? Run `git config --global credential.helper wincred`
* ... deal with a merge conflict? Cry. Loudly.
* ... actually deal with a merge conflict? Run `git status` to see what files have conflicts and read through the conflicts. A merge conflict will be set off by `<<<<<<<<<<`,
  and the two conflicting segments are separated by `=======`. The line `>>>>>>>> [SHA hash]` signifies the end of the conflicts.  The code before the `=======` is normally
  what was there before you tried to merge, and after is what would replace it. Use this information to try to figure things out on your own, but if you want a second
  opinion, or need help figuring things out, don't be afraid to ask someone for help.




---Stuff added by Batch Aug 07---



###### I need to use Karma for Unit Testing!  How make?  What do? ######

Karma is an awesome tool that, in conjunction with Jasmine, allows you to test AngularJS.  Setting it up can be
confusing, however.  If you need to familiarize yourself with Karma and Jasmine, this URL contains solid resources
to get you up to speed quickly: http://www.bradoncode.com/blog/2015/05/12/angularjs-testing-getting-started/
However, as informative as this walk-through is, it doesn't guide you through the steps to setting up Karma and
Jasmine for this project.  To do so, follow these steps:

    1) Install a current version of Node.js (v6.11.2 was used as of the writing of this guide)
    2) Install a current version of NPM (v3.10.10 was used as of the writing of this guide)
    3) Open a Command Prompt and navigate to the project directory (example: "cd dir1/dir2/.../assignforce_dir_name")
    4) Enter the following command: "npm install -g karma-cli"
        - This installs a global Command Line Interface for Karma, which is necessary to run Karma in Command Prompt
    5) Enter the following command: "npm install"

This last command looks at the "package.json" file and pulls in ALL the Node.js dependencies required for unit-
testing AngularJS within this project.  In some rare circumstance, however, that you do NOT have a package.json
manifest file, do not panic.  There is a way to locate all of the dependencies you need.  Performing the following
steps will grant you the files you need:

    6) Create a new text file that contains the following characters: "{}"
    7) Rename the file and extension to "package.json"
    8) Install Jasmine Core, Karma, Karma-Jasmine, and Karma Chrome Launcher using the following command:
        npm install jasmine-core karma karma-jasmine karma-chrome-launcher --save-dev

This last command should give you all the dependencies you need to run Karma.  Notice the "--save-dev" option.  This
will add each of these modules as dependencies within the "package.json" file that you created.  At this point, you
will not actually be able to use Karma to run the existing unit tests.  Instead, what will happen is that, when you run
Karma, it will fail.

    9) Enter the following command: "karma start karma.conf.js"

This tells Karma to start, using "karma.conf.js" as its configuration file.  At this point, Karma will fail.  It will
then spit out a list of "WARN [watcher]:" messages describing patterns that are missing.  Each of these messages is a
module that you will have to install using the following command pattern:

    npm install __MODULE_NAME_HERE___ --save-dev

The module name will be a name within the "WARN [watcher]" messages.  Specifically, a file path will appear.  You are
looking for the name immediately following "...node_modules/".  Thus, if you see "".../node_modules/THIS/that/OTHER.js",
you will enter the command "npm install THIS --save-dev".  Repeat this for every "WARN [watcher]" line you receive.
Alternatively, you can attempt to condense these into a single command.  If your module names are thing1, thing2,
thing3, thing4, and thing5, your command will look like:

    npm install thing1 thing2 thing3 thing4 thing5 --save-dev

Use whichever method you feel most comfortable with to install each of the listed node modules.  Once you have finished
this process, you will have a "package.json" that contains all of the node module dependencies required to conduct
the Karma unit testing necessary.  From here on, simply by having that "package.json" file, you can use "npm install"
to install all the dependencies needed to conduct automated unit testing.

###### Design Notes ######
removing curricula only sets its active property to false
    it does not remove from database
    actual remove may lead to issues with existing batches that have the deleted curriculum

Curricula Tab edit curriculum does not initialize existing skills as selected