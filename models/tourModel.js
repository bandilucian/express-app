const mongoose = require('mongoose');
const slugify = require('slugify');
const validator = require('validator');

const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A tour must have a name '],
      unique: true,
      trim: true,
      maxlength: [40, 'A tour must have less or equal than 40 characters'],
      minlength: [10, 'A tour must have less or equal than 10 characters'],
      // validate: [validator.isAlpha,'Tour name must onlt contains characters']
    },
    slug: String,
    duration: {
      type: Number,
      required: [true, 'A tour must have a duration'],
    },
    maxGroupSize: {
      type: Number,
      required: [true, 'A tour must have a group size'],
    },
    ratingAverage: {
      type: Number,
      default: 4.5,
      min: [1, 'Rating must above 1.0'],
      max: [5, 'Rating must below 5.0'],
    },
    ratingQuantity: {
      type: Number,
      default: 0,
    },
    difficulty: {
      type: String,
      required: [true, 'A tour must have a difficulty'],
      enum: {
        //enum este folosi pt a limitanumarul de alegeri
        values: ['easy', 'medium', 'difficult'],
        message: 'Difficulty must be:easy,medium,difficult',
      },
    },
    price: {
      type: Number,
      required: [true, 'A tour must have a price'],
    },
    priceDiscount: {
      type: Number,
      validate: {
        validator: function (val) {
          //this. merge aici doar cand creezi si nu pentru cand faci update
          return val < this.price; // 250 < 200 false
        },
        message: 'Discount price ({VALUE}) should be below the regular price'
      },
    },
    summary: {
      type: String,
      trim: true,
      required: [true, 'A tour must have a summary'],
    },
    description: {
      type: String,
      trim: true,
    },
    imageCover: {
      type: String,
      required: [true, 'A tour must have cover image'],
    },
    images: [String],
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false,
    },
    startDates: [Date],
    secretTour: {
      type: Boolean,
      default: false,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

tourSchema.virtual('durationWeeks').get(function () {
  return this.duration / 7;
});

//DOCUMENT MIDDLEWARE:runs before .save() and create()

tourSchema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
}); //este n middleware spefici mongoose care actioneaza inainte sa se salveze,ar trebuie sa folosim nexr dar nu merge

//QUERY MIDDLEWARE

// tourSchema.pre('find', function (next) {
tourSchema.pre(/^find/, function (next) {
  // toate stringurile care incep cu find
  this.find({ secretTour: { $ne: true } });
  this.start = Date.now();
  next();
});

tourSchema.post(/^find/, function (docs, next) {
  console.log(`Query took ${Date.now() - this.start} miliseconds`);
  // console.log(docs);
  next();
});

//AGGREGATION MIDDLEWARE
tourSchema.pre('aggregate', function (next) {
  this.pipeline().unshift({ $match: { secretTour: { $ne: true } } }); //cu unshift adaugi un element in array la inceput

  console.log(this.pipeline());
  next();
});

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
