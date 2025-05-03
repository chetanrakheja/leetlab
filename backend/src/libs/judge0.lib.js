import axios from "axios";


const customSleep = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
}


export const getJudge0LanguageId = (language) => {
    const languageMap = {
        'PYTHON': 71,
        'JAVA': 62,
        'JAVASCRIPT': 63,
    };

    return languageMap[language.toUpperCase()]
}


export const pollBatchResults = async (tokens) => {
    while (true) {
        const {data} = await axios.get(`${process.env.JUDGE0_API_URL}/submissions/batch/`,
            {
                params: {
                    tokens: tokens.join(","),
                    base64_encoded: false,
                }
            });

            const results = data.submissions;
            const isAllDone = results.every(result => result.status_id !== 1 && result.status_id != 2);

            if (isAllDone) {
                return results;
            }
            await customSleep(2000);

    }


}

export const submitBatch = async (submissions) => {
    const {data} = await axios.post(`${process.env.JUDGE0_API_URL}/submissions/batch?base64_encoded=false`,
        {submissions
        })
        console.log("Submission result:", data);
        return data;

}



