module.exports = (fn) => {
    return (req, res, next) => {
      fn(req, res, next).catch(next); // folosind next prindem erroarea ca si (err) => next(err)
    }; // facem un return anonim pt ca functie sa fie chemata doar atunci cand cineva face un request
  };