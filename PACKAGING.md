Packaging
=========

Project Structure
-----------------
* [src] - all the source code and resources. May also contain non-modulable libraries like Google Analytics.
* [dist] - exacutable extension files. Can be run as unpacked extension or packed into .zip and deployed
* [node_modules] - all third party js dependencies. Not saved to git. Restored based on [package.json] and [package-lock.json]
* [test] - source code of all tests

Configuration files
-------------------
* [package.json] contains main information about the project, including:
    * name and version of the project (version is propagated to manifest.json during build)
    * third-party dependencies required to build and test project (`devDependencies`)
    * definition of commands to build and test application (`scripts`)
* [package-lock.json] contains versions of "dependencies of dependencies". In bigger project it should help to manage problems with different versions of sub-dependencies and circular dependencies.
* [webpack.config.js] defines how the project will be build during `npm run build`
* [karma.conf.js] defines how tests are being run during `npm run test`
* [./config/] directory with environemnt specific configurations
