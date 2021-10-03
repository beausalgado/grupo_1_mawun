const db = require('../database/models'); // Llamo los models de la base de datos en SQL
const { Op } = require("sequelize");

const Order = {
    all: function() {
       return db.Order.findAll({
           include: [{association: "users"}, {association: "items_carrito"}]
        })
},
    findPK: function (PK) {
         return   db.Order.findByPk(PK, {
            include: [{association: "products"}, {association: "users"}, {association: "items_carrito"}],
            raw: true,
            nested: true
        })
    },
    findByUser: function (userID) {
        return   db.Order.findOne({
            include: [{association: "products"}, {association: "users"}, {association: "items_carrito"}],
            raw: true,
            nested: true,
            where: {user_id: userID}
   })
},
    search: function(text) {
       return  db.User.findAll({
            order:[['name','ASC']],
            include: [{
                association: "roles"
        },
        {
            association: "addresses"
    }],
            raw: true,
            nested: true,
            where: {
                [Op.or]: [
                 {name: { [Op.like]: '%' + text + '%' }},
                 {last_name: { [Op.like]: '%' + text + '%' }},
                 {email: { [Op.like]: '%' + text + '%' }}
                ]
              }
            })  
     },
    create: function(orderData) {
        return db.Order.create(orderData, {include: [{association: "items_carrito"}]})
    },
    createAssociation: function(orderData) {
        return db.Order_product.create(orderData)
    },
    update: function(userData, ID) {
       return db.User.update(userData,
            { include: [{association: "roles"}],
            where: {id: ID}
        });
    },
    updateAddress:  function(userData, ID) {
        return db.Address.update(userData,
             {
             where: {user_id: ID}
         });
     },
     createAddress:  function(userData) {
        return db.Address.create(userData);
     },
    delete: function(ID) {
       return db.User.destroy({
            where: {
                id: ID,
            }
        });

    }
}


module.exports = Order