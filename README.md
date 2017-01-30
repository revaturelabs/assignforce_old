# AssignForce
A scheduling application

## About the codebase

There are two main branches: **master** and **development**.  As a developer, you're not allowed to touch either of them directly.

The **master** branch is the copy of the application that's running on the production server

The **development** branch is the copy of the application that's running on the production server

When you'd like to work on a feature, make a feature branch, and create a Pull Request (a request to merge) to the development branch.

After you feel your work is satisfactory, comment `RFI` on your Pull Request, and your team lead will review your code, and, if accepted, it will be merged onto the development branch.

On every merge to development, it is important that all developers pull the latest version of the development branch to ensure everyone's working on the same codebase.

Periodically, work on the development branch will be merged to the master branch.

## How to Set Up your Environment

1. Make sure *Maven* is installed and accessible my the `mvn` command on Git Bash or Windows CommandLine
2. Make sure your *JAVA_HOME* environmental variable is set to something like *C:\Program Files\Java\jdk1.8.0_101*
3. Create a GitHub account, and direct message Chris with your GitHub username
5. Set up the environmental variables as described in Slack
6. Clone this project on your local machine (run `git clone https://github.com/revaturelabs/assignforce.git` )
7. Open an instance of Git Bash in the *Jars* folder and run this command: `mvn install:install-file -Dfile=ojdbc7.jar -DgroupId=com.oracle -DartifactId=ojdbc7 -Dversion=12.1.0.1 -Dpackaging=jar`
8. Download and use [Spring Tool Suite](https://spring.io/tools/sts/all) for the development of this application
9. In Spring Tool Suite, select `File->Import...`
  * In the `General` folder, select `Projects from Folders or Archive`.
  * Select the folder of the repo you just copied
  * Finish the operation, and allow Maven to do an initial build of the project
10. At this point, you should be able to run the project as a Spring Boot App and access the project on your browser at `http://localhost`
  * NOTE: If you want to override the default port, set the environment variable `SERVER_PORT` to whatever port you desire
11. Create a feature branch and pull request for the issue you're working, such as `AwesomeFeature`. To do this:
  * On Git Bash, use `git checkout development` to make sure you're on the development branch
  * Run `git pull` to pull the latest code
  * Use `git checkout -b AwesomeFeature` to create a local branch for your user-story
  * Make a small change to your feature branch and commit it One option for doing this is to touch a dummy file, to do that, follow these steps:
    1. Run `touch dummy.txt`
    1. Run `git add dummy.txt`
    1. Run `git commit -am "added dummy"`
  * Type `git push --set-upstream origin AwesomeFeature` to create the branch remotely (For subsequent pushes, you can simply use `git push`)
  * If you created a dummy file, revert it with the following steps:
    1. `git rm dummy.txt`
    1. `git commit -am "removed dummy file"`
    1. `git push`
  * On GitHub, you should see a box near the top saying that you recently pushed to it, and you'll see a button labeled *Compare & pull request* .
  * Click that, give your pull request the same name as your branch, and continue working. Each commit will run a feature test
12. To access the database, use [SQL Developer](http://www.oracle.com/technetwork/developer-tools/sql-developer/downloads/index.html).  
  * Create a new connection with the username and password you found in the Slack information (check the *Save Password* box for your convienance)
  * for the URL, take the URL that you found in the Slack information, and omit `jdbc:oracle:thin:@` at the beginning and `:1521:ORCL` at the end
  * Use port `1521`
  * Use the SID `ORCL`
  * Test the connection
  * If it works, save it and connect to it

## I haven't used Git Bash in a long while! How do I...
* generally use it? After you've cloned as above and created your branch, the general flow is:
  1. Before you start working, run a `git pull` to make sure you have the most up to date code (especially if there are other people on the same branch as you)
  1. Work on your stuff
  1. Before you're ready to push, run a `git pull` and deal with any merge conflicts
  1. Add files by running `git add [files you created]`
  1. Commit your changes by running `git commit -am "[message about what you did]"`
  1. Push your changes by running `git push` (use `git push --set-upstream origin [branch name]` if it's your first time pushing to the branch)
* stop it from asking me for my password every time I push? Run `git config --global credential.helper wincred`
* deal with a merge conflict? Cry. Loudly. 
* actually deal with a merge conflict? Run `git status` to see what files have conflicts and read through the conflicts. A merge conflict will be set off by `<<<<<<<<<<`, and the two conflicting segments are separated by `=======`. The line `>>>>>>>> [SHA hash]` signifies the end of the conflicts.  The code before the `=======` is normally what was there before you tried to merge, and after is what would replace it. Use this information to try to figure things out on your own, but if you want a second opinion, or need help figuring things out, don't be afraid to ask someone for help.
