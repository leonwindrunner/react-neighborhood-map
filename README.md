# Restaurants Near Me

## Project Purpose:
This app is to locate restaurants by map. It also includes a search input that filters out the markers. 

## Project Features
1. Click on any marker to see the location details fetched from the [FourSquare APIs](https://developer.foursquare.com/).
2. Search through availaible locations.

## Loading the App in Development Mode

1. Clone this repository to your computer
2. Install all the dependencies with `npm install`
3. Launch the app with this command `npm start`

The app will launch in your browser at the address[http://localhost:3000/](http://localhost:3000/).

***NOTE:*** *The service workers for this app will only cache the site when it is in production mode.*

## Loading the App in Production Mode

To run the app in production mode run:
```
npm run build
```
Then navigate to the build directory and start a localhost with python
```
python -m SimpleHTTPServer 5000
```
After that navigate to [http://localhost:5000](http://localhost:5000) in your browser.

## Project APIs

### Google Maps
This application uses Google maps to display the markers.

### Foursquare
This application uses Foursquare to get information about the locations.

## Enjoy.
