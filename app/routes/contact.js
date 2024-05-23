const express = require("express");
const { ContactModel, Pager, sortContacts, filterContacts } = require("@jworkman-fs/asl");
const router = express.Router();

// GET
router.get("/", (req, res, next) => {
  try {
    // Filtering
    const headerFilterBy = req.header("X-Filter-By");
    const headerFilterOperator = req.header("X-Filter-Operator");
    const headerFilterValue = req.header("X-Filter-Value");
    let allContacts = ContactModel.index();

    if (headerFilterBy || headerFilterOperator || headerFilterValue) {
      allContacts = filterContacts(allContacts, headerFilterBy, headerFilterOperator, headerFilterValue);
    }

    // Sorting
    if (req.query.sort) {
      const sortBy = req.query.sort || "lname";
      const sortOrder = req.query.direction || "asc";
      allContacts = sortContacts(allContacts, sortBy, sortOrder);
    }

    // Pagination
    const page = Number(req.query.page);
    const limit = Number(req.query.limit);
    const pager = new Pager(allContacts, page, limit);

    // returning pager.total() reduces tests passed down to 4 from currest, highest passing number of tests
    res.setHeader("X-Page-Total", pager.total);

    res.setHeader("X-Page-Next", pager.next());
    res.setHeader("X-Page-Prev", pager.prev());

    res.status(200).json(pager.results());
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET by ID
router.get("/:id", (req, res, next) => {
  const id = req.params.id;

  try {
    const contact = ContactModel.index().find((contact) => contact.id === Number(id));

    if (contact) {
      res.status(200).json(contact);
    } else {
      res.status(404).json({ message: `Contact not found` });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST
router.post("/", (req, res, next) => {
  try {
    const newContact = ContactModel.create(...req.body);
    console.log(newContact);
    res.status(303).redirect(`/v1/contacts/${newContact.id}`).json(newContact);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// PUT by ID
router.put("/:id", (req, res, next) => {
  const id = req.params.id;

  try {
    const contact = ContactModel.index().find((contact) => contact.id === Number(id));
    if (contact) {
      const updateContact = ContactModel.update(contact, ...req.body);
      res.status(303).redirect(`/v1/contacts/${updateContact.id}`).json(updateContact);
    } else {
      res.status(404).json({ message: `Contact not found` });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE by ID
router.delete("/:id", (req, res, next) => {
  try {
    const id = req.params.id;
    const contact = ContactModel.index().find((contact) => contact.id === Number(id));
    // const deleteContact = ContactModel.delete(contact);

    if (contact) {
      ContactModel.delete(contact);
      res.status(303).redirect("/contacts").end();
    } else {
      res.status(404).json({ message: `Contact not found` });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
