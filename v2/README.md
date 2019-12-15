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
	6.2. Make campgrounds display in a grid  
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
  