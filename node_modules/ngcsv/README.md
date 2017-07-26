# angular-csv
An AngularJS service to handle CSV files with ease and convert to JSON.

## Installation
Make sure you have NPM installed on your computer.
```
npm install --save ngcsv
```

Include ngcsv.js or ngcsv.min.js to your project (add to main HTML file).
```
<script type="text/javascript" src="./node_modules/ngcsv/ngcsv.min.js"></script>
```

Change "./node_modules/" accordingly to your project NPM settings.

## Usage
In your app definition, add "ngcsv" as a dependency. For example:
```
angular.module('myapp',['ngcsv']);
```

To use it in a controller, add "$csv" service dependency:
```
angular.controller('MyController',function($csv){
  // ...
});
```

## Convert CSV to JSON
After $csv service is loaded, you can use convertToJson function. It will return a JavaScript array of objects.
```
var array = $csv.convertToJson( csvString );
```
For full guide, please refer to this [documentation](http://dhanang.me/ngcsv).


## Contribution
Please help to create this project better by submitting bug reports or pull requests. Thank you!
