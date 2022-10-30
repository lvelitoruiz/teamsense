import { useEffect, useState } from "react";
import Question from "src/components/Question";
import Survey, { ISurvey } from "../entities/Survey";
import SurveyResponse, { ISurveyResponse } from "../entities/SurveyResponse";
import {Container, Button} from 'react-bootstrap';
import { Link } from "react-router-dom";
import toast, { Toaster } from 'react-hot-toast';

interface SurveyProps {
    surveyId: number;
}

const SurveyView = (props: SurveyProps) => {
    const [survey, setSurvey] = useState<ISurvey | null>(null);
    const [surveyResponse, setSurveyResponse] = useState<ISurveyResponse| null>(null);

    const onSurveySubmit = () => {
        const saveSurvey = async (): Promise<void> => {
            const response = await fetch(
                `http://localhost:2047/api/responses/`,
                {
                    method: "POST",
                    headers: {"Content-Type": "application/json"},
                    body: JSON.stringify({response: surveyResponse})
                }
            );

            if (!response.ok) {
                console.error(`API failure: ${response.status}`, await response.json());
                toast.error(`API failure: ${response.status}`)
            }
        };

        // TODO: Saving state
        console.log("Saving...");
        saveSurvey();
        console.log("done.");
        toast.success("Done!")
    }
    useEffect(() => {
        const loadSurvey = async (): Promise<void> => {
            const response = await fetch(`http://localhost:2047/api/surveys/${props.surveyId}`);
            let data;
            try {
                data = await response.json();
            } catch(error) {
                console.error(error);
                toast.error('' + error)
                data = null;
            }

            if (response.ok) {
                setSurvey(new Survey(data.survey))
                setSurveyResponse(new SurveyResponse(data.survey.id))
            } else {
                console.error(`API failure: ${response.status}`, data);
                toast.error(`API failure: ${response.status}`)
            }
        }
        // TODO: Loading state
        console.log("loading...");
        loadSurvey();
        console.log("done.");
        toast.success("Done!")
    }, [props]);

    const onSurveySelection = (question: string, answer: string) => {
        if (surveyResponse == null) return;

        const index = surveyResponse.content.questions.findIndex(value => {
            return value.question === question;
        });
        if (index < 0) {
            surveyResponse.content.questions.push({question: question, answer: answer});
        } else {
            surveyResponse.content.questions[index].answer = answer;
        }

        setSurveyResponse(surveyResponse);
    };

    let qAndA = null;
    if (survey) {
        qAndA = survey.content.questions.map((question, index) => {
            return <Question question={ question }
                             onSelection={ onSurveySelection }
                             key={ index } />
        });
    }

    return (
        <Container className="pad-t">
            <h1>Survey {props.surveyId}</h1>
            { qAndA }
            <Button
                className="text-uppercase mb-4"
                variant="success"
                block={true}
                onClick={event => {
                    event.stopPropagation();
                    onSurveySubmit(); }}
            >
                Respond!
            </Button>
            <Link className="text-center d-block" to={'/ranking'}>Watch the Ranking of responses</Link>
            <Toaster />
        </Container>
    )
}

export default SurveyView;
