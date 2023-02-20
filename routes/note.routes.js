const express = require("express")
const { NoteModel } = require("../model/note.model")

const noteRouter = express.Router()

noteRouter.get("/", async (req, res) => {
    const notes = await NoteModel.find()
    res.send(notes)
})

noteRouter.post("/create", async (req, res) => {
    const payload = req.body
    const note = new NoteModel(payload)
    await note.save()
    res.send({ "msg": "Note created" })
})

noteRouter.patch("/update/:id", async (req, res) => {
    const id = req.params.id
    const payload = req.body
    const note = await NoteModel.findOne({ "_id": id })
    const userID_in_note = note.user
    const userID_making_req = req.body.user
    try {
        if (userID_making_req !== userID_in_note) {
            res.send({ "msg": "You are not authorized" })
        } else {
            await NoteModel.findByIdAndUpdate({ _id: id }, payload)
            res.send({ "msg": `Note with id${id} has been updated` })
        }

    } catch (err) {
        console.log(err)
        res.send({ "msg": "Something went wrong", "error": err.message })
    }
})

noteRouter.delete("/delete/:id", async (req, res) => {
    const id = req.params.id
    const note = await NoteModel.findOne({ "_id": id })
    const userID_in_note = note.user
    const userID_making_req = req.body.user
    try {
        if (userID_making_req !== userID_in_note) {
            res.send({ "msg": "You are not authorized" })
        } else {
            await NoteModel.findByIdAndDelete({ _id: id })
            res.send({ "msg": `Note with id${id} has been updated` })
        }

    } catch (err) {
        console.log(err)
        res.send({ "msg": "Something went wrong", "error": err.message })
    }
})

module.exports = {
    noteRouter
}