# target_reviews_component

This service provides the reviews component of a Target item page.

To start this service:

Install dependancies via "npm install"

Start the server via "npm start"

In another terminal window, seed the database by typing "npm run db:seed"

Have webpack watch the files via "npm run build"

Reviews should now be rendered on port 3001.

Update with the information for CRUD operations:

* `GET /api/reviews/:id` - Returns all the reviews for a given id
* `POST /api/reviews/:id` - Creates a new review for given `id`
* `DELETE /api/reviews:id` - Deleted a single review for a given `id`, the `review id` to be deleted in sent in the request body
* `PUT /api/reviews/:id` - Idempotent update for a review at a given `id`