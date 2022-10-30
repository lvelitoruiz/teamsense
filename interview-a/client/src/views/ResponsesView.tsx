import React, { useEffect, useState } from "react";
import toast, { Toaster } from 'react-hot-toast';

interface IResponseList {
    'question': string,
    'answers': string[]
}

interface IResponseData {
    'content': {
        'questions': {
            'question': string,
            'answer': string;
        }[]
    }
}


const ResponseView = () => {

    const [responseList, setResponseList] = useState<IResponseList[]>();

    useEffect(() => {
        const loadResponses = async (): Promise<void> => {
            const response = await fetch(`http://localhost:2047/api/responses`);
            let data: any;
            try {
                data = await response.json();
            } catch (error) {
                console.error(error);
                toast.error('' + error);
                data = null;
            }

            if (response.ok) {

                let filteredNew: IResponseList[] = [];
                data.responses.map((item: IResponseData) => {
                    const question = item.content.questions[0].question;
                    const answer = item.content.questions[0].answer;
                    if (filteredNew.some((item, index: number) => item['question'] === question)) {
                        filteredNew.map(item => {
                            if (item.question === question) {
                                item.answers.push(answer)
                            }
                        })
                    } else {
                        const element: IResponseList = { 'question': question, 'answers': [answer] };
                        filteredNew.push(element);
                    }
                })

                setResponseList(filteredNew);
            } else {
                console.error(`API failure: ${response.status}`, data);
                toast.error(`API failure: ${response.status}`)
            }
        }
        loadResponses();
    }, []);


    return (
        <>
            {
                (responseList !== undefined) &&
                <>
                    {
                        responseList.map((item: any, index: number) => {
                            const elements: any[] = [];
                            item.answers.map((subItem: any) => {
                                return elements.push(subItem)
                            });
                            let count = Array.from(
                                elements.reduce((r, c) => r.set(c, (r.get(c) || 0) + 1), new Map()),
                                (([key, count]) => ({ key, count }))
                            )
                            count = count.sort((a, b) => b.count - a.count);
                            return (
                                <div key={index}>
                                    <h2>{item.question}</h2>
                                    <div className="row">
                                    {
                                        count.map((item: any, index: number) => {
                                            return (
                                                <div className="col-3 p-4" key={index}>
                                                    <div className="card text-center">
                                                        {/* <img src="..." className="card-img-top" alt="..." /> */}
                                                        <div className="card-body">
                                                            <h5 className="card-title">{item.key}</h5>
                                                            <hr />
                                                            <p className="card-text">{item.count}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })
                                    }
                                    </div>
                                </div>
                            )
                        })
                    }
                </>
            }
            <Toaster />
        </>
    )
}


export default ResponseView;