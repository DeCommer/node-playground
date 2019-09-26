const mongoose = require('mongoose');
const mongo = require('mongodb');
const Schema = mongoose.Schema;

mongoose.connect(process.env.MONGO_URI)

const schema = new mongoose.Schema({ 
  name: 'string', 
  age: 'number',
  favoriteFoods: 'array'
});

var Person = mongoose.model('Person', schema);

const createAndSavePerson = (done) => {
  const person = new Person({
      name: 'shit', 
      age: 210, 
      favoriteFoods: ['chinese', 'water', 'coffee']
  })
  person.save((err, data) => (err ? done(err) : done(data))
)};

const arrayOfPeople = [{
      name: "sal", age: 10, favoriteFoods: ["Pizza", "Hot Dogs", "Lard"],
      name: "kilbert", age: 33, favoriteFoods: ["shoveit", "doughnut", "fat"],
      name: "fudgy", age: 345, favoriteFoods: ["dog", "horse", "all foods"],
      name: "foog", age: 10, favoriteFoods: ["Pizza", "Hot Dogs", "Lard"],
      name: "doog", age: 33, favoriteFoods: ["meat", "pig feet", "fat"],
    }]

const createManyPeople = (arrayOfPeople, done) => {
    Person.save(arrayOfPeople, (err, data) =>{
      if (err) {
        return done(err);
      }
      return done(null, data);
    });
};
                  
var findPeopleByName = function(personName, done) {

var query = Person.find( {name: personName})
    query.exec(function (err, data) {
     if(err) return done(err)
    return done(null,data);     
    }); 
 }

var findOneByFood = function(food, done) {
  Person.findOne({favoriteFoods: food}, function(err, data) {
    console.log(data);
    if(err) return done(err);
    return done(null, data)
  })
  
};

var findPersonById = (personId, done) => {
Person.findById(personId, (err, data) => err ? done(err) : done(null, data));
};

var findEditThenSave = function(personId, done) {
  var foodToAdd = "hamburger";
  Person.findById(personId, function(err, data) {
    if (err) {
      done(err);
    }
    data.favoriteFoods.push(foodToAdd);
    data.save((err, data) => (err ? done(err) : done(null, data)));
  });
};

var findAndUpdate = function(personName, done) {
  var ageToSet = 20;

  Person.findOneAndUpdate(
    {name: personName},
    {$set: {age: ageToSet}},
    {new: true},
    (err, data) => {
      if (err) return done(err, data);
      return done(null, data);
    }
  );
};

var removeById = function(personId, done) {
  Person.findByIdAndRemove(personId, (
    err, data) => err ? done(err) : done(null, data));
};

var removeManyPeople = function(done) {
  var nameToRemove = "Mary";
  Person.remove({name: nameToRemove}, (
    err, data) => err ? done(err) : done(null, data));
};

var queryChain = function(done) {
  var foodToSearch = "burrito";
  Person.find({favoriteFoods:foodToSearch}).sort({ name: 1 }).limit(2).select('-age').exec((err,data) =>{   
   
    err ? done(err): done(null, data);
    
  })
  
};