==========v1==========	

1. node -init  
2. Install express and ejs.  
3. Add route for landing page and the campgrounds page.  
4. Layout and Basic Styling  
	4.1. Create Header and Footer partials  
	4.2. Add Bootstrap  
5. Creating new Campgrounds  
	5.1. Setup new Campground POST route  
	5.2. Add in body-parse (npm install body-parser --save)  
	5.3. Setup Route to show form  
	5.4. Add basic unstyled form  
6. Style the Campgrounds Page  
	6.1. Add a better header/title  
	6.2. Mak ecampgrounds display in a grid  
7. Style the navbar and Form  
	7.1. Add a navbar to all templates  
	7.2. Style the new campground form  

==========v2==========	
  
8. Add Mongoose  
	8.1. Install and Configure Mongoose  
	8.2. Setup Campground Model  
	8.3. Use Campground model inside our routes  
9. Show Page  
	9.1. Review the REST'ful Routes we've seen so far  
	9.2. Add description to our campground model  
	9.3. Show db.collection.drop()  
	9.4. Add a show route/template  
  
	NOTE: The "/campgrounds/new" route should be defined before the "/campgrounds/:id" route, cause ":id" means anything, be it a number or "new".  
   	
==========v3==========	
  
10. Refactor Mongoose Code  
	10.1. Create a models directory  
	10.2. Use module.exports  
	10.3. Require everything correctly!  
11. Add Seeds file  
	11.1. Add a seeds.js file  
	11.2. Run the seeds file every time the server starts  
12. Add the Comment Model  
	12.1. Clear the errors  
	12.2. Display comments on campgrounds show page  
  
==========v4==========  
  
13. Comments New/Create-Discuss Nested Routes  
	13.1. Add the comment new and create route  
	13.2. Add the comment form  
  
==========v5==========  
  
14. Style Show Page  
	14.1. Add sidebar to show page  
	14.2. Display Comments nicely  
15. Add custom CSS file  
	15.1. Style the Show page  
  
==========v6==========  
  
16. Add User Model(Adding Authetication)  
	16.1. Install all packages needed for auth  
	\-install passport, passport\-local, passport\-local\-mongoose, express\-session  
	16.2. Define User Model  
17. Register  
	17.1. Configure Passport  
	17.2. Add register routes  
	17.3. Add register template  
18. Login  
	18.1. Add login routes  
	18.2. Add login template  
19. Logout & refactor the Navbar  
	19.1. Add logout route  
	19.2. Prevent users from adding a comment if they are not signed in  
	19.3. Add links to navbar  
	19.4. Show/hide auth links correctly  
20. Show/hide auth links in Navbar  
