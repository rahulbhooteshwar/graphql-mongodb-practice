export default {
  initDates: (schema, next) => {
    // get the current date
    const currentDate = new Date();

    // change the updated_at field to current date
    schema.updated_at = currentDate;

    // if created_at doesn't exist, add to that field
    if (!schema.created_at)
    schema.created_at = currentDate;

    next();
  }
}