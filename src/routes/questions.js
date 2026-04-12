const express = require("express");
const router = express.Router();

const questions = require("../data/questions");

// GET /posts
// List all posts
router.get("/", (req, res) => {
  const { keyword } = req.query;

  if (!keyword) {
    return res.json(questions);
  }

  const filteredQuestions = questions.filter(question =>
    question.keywords.includes(keyword.toLowerCase())
  );

  res.json(filteredQuestions);
});

// GET /posts/:postId
// Show a specific post
router.get("/:questionId", (req, res) => {
  const questionId = Number(req.params.questionId);
  const question = questions.find((q) => q.id === questionId);

  if (!question) {
    return res.status(404).json({ message: "Question not found" });
  }

  res.json(question);
});

//POST
router.post("/", (req,res) => {
    const {ques, date, answer, keywords} = req.body;
    if (!ques || !date || !answer) {
        return res.status(400).json({msg: "question,answer and date are required"})
    }
    
    const existingIds = questions.map(q => q.id);
    const maxId = Math.max(...existingIds)

    const newQuestion = {
        id: questions.length ? maxId + 1 : 1,
        ques, date, answer,
        keywords: Array.isArray(keywords) ? keywords : []
    }
    questions.push(newQuestion);
    res.status(201).json(newQuestion);
});

//PUT
router.put("/:questionId", (req, res) => {
  const questionId = Number(req.params.questionId);
  const question = questions.find((q) => q.id === questionId);

  if (!question) {
    return res.status(404).json({ message: "Question not found" });
  }

  const {ques, date, answer, keywords} = req.body;
    if (!ques || !date || !answer) {
        return res.status(400).json({msg: "question,answer and date are required"})
    }

  question.ques = ques;
  question.date = date;
  question.answer = answer;
  question.keywords = Array.isArray(keywords) ? keywords : [];
  
  res.json(question);

});

//DELETE
router.delete("/:questionId", (req, res) => {
  const questionId = Number(req.params.questionId);
  const questionIndex = questions.findIndex(q => q.id === questionId);

  if(questionIndex === -1){
    return res.status(404).json({msg:"Question not found"})
  }
  const deletedQuestion = questions.splice(questionIndex, 1);
  res.json({
    msg: "Question deleted successfully", 
    question: deletedQuestion
  });
});

module.exports = router;