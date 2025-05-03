import {db} from "../libs/db.js";


export const createProblem = async (req, res) => {
 const { title, description, difficulty, tags,examples,constraints,testcases,codeSnippets,referenceSolutions } = req.body;

 if (req.user.role !== "admin") {
   return res.status(403).json({ message: "Forbidden - Only admins can create problems" });
 }

 try{
    for (const[language,solutionCode] of Object.entries(referenceSolutions)) {
        const languageId = getJudge0LanguageId(language);
        if (!languageId) {
            return res.status(400).json({ message: `Unsupported language: ${language}` });
        }
        const submission =  testcases.map((input,output) => ({
            source_code: solutionCode,
            language_id: languageId,
            stdin: input,
            expected_output: output
        }));
        const submissionResults = await submitBatch(submission);

        const tokens = submissionResults.map(res => res.token);

        const results = await pollBatchResults(tokens);

        for (let i = 0; i < results.length; i++) {
            const result = results[i];
            console.log("Result:", result);
            if (result.status_id !== 3) {
                return res.status(400).json({ message: `Test case ${i + 1} failed: ${result.message}` });
            }
        }

        // Save the problem to the database
        const newProblem = await db.problem.create({
            data: {
                title,
                description,
                difficulty,
                tags,
                examples,
                constraints,
                testcases,
                codeSnippets,
                referenceSolutions,
                userId: req.user.id,
            }
        });

        return res.status(201).json({
            message: "Problem created successfully",
            problem: newProblem
        });


    }

 }catch (error) {
   console.error("Error creating problem:", error);
   return res.status(500).json({ message: "Internal server error" });
 }



}

export const getAllProblems = async (req, res) => {}

export const getProblemById = async (req, res) => {}

export const updateProblem = async (req, res) => {}

export const deleteProblem = async (req, res) => {}

export const getAllProblemsSolvedByUser = async (req, res) => {}

