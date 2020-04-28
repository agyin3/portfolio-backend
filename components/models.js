const db = require('../data/dbConfig.js')

module.exports = {
    add,
    find,
    remove,
    update,
    findBy
}

function find(table){
    return db(table)
}

function findBy(table, filter){
    return db(table)
        .where(filter)
        .first()
}

function add(table, info){
    return db(table)
        .insert(info)
        .returning("id")
        .then(([id]) => findBy(table, {id}))
}

function update(table, id, changes){
    return db(table)
        .where({id})
        .update(changes)
        .then(() => findBy(table, {id}))
}

function remove(table, id){
    return db(table)
        .where({id})
        .del()
}