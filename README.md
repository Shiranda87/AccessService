# AccessService

1. Download the code from GitHub:
https://github.com/Shiranda87/AccessService

2. In the root directory run:
docker-compose up

3. Go to:
http://localhost:5000/

4. All of the requests will have a hard coded authenticated user id. 
In order to change the user id (to see different users outputs from the db), please change the value of req.userId in app.ts => authenticateRequest() => line 43.

5. API:
  - POST http://localhost:5000/access/ 
	  - Creates a new api key
	  - Please send in the body (urlencoded):
 		  key - permissions
		  value - the permissions separated by comma (for example: read, write)
	  - The response will contain the new AccessToken object that was stored in the DB.
	  - Please save the key from the response for the next requests (will be obstructed from now on).
  - GET http://localhost:5000/access/
	  - Gets all the api keys of the authenticated user (obstructed)
  - POST http://localhost:5000/access/authenticate
	  - Creates a new JWT token
	  - Please send in the body (urlencoded):
		  key - apiKey
		  value - an api key (from the create apiKey request)
	  - The new JWT will return in the response
	  - You can see the the updated usage date in the get all request
  - DELETE http://localhost:5000/access/<apiKey>
	  - Please use an api key from the create apiKey request for the parameter in the url
