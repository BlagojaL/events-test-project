import React, { useContext, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button, Card, Form, FormGroup, Modal } from 'semantic-ui-react';
import { UserContext } from './UserContext';

export type EventType = {
    _id: string;
    title: string;
    description: string;
    price: string;
    date: string;
    creator: {
        _id: string;
        email: string;
    }
};

const EventsPage = () => {
    const [isCreateEventModalOpen, setCreateEventModalOpen] = useState<boolean>();
    const [isBookEventModalOpen, setBookEventModalOpen] = useState<boolean>();
    const { register, handleSubmit } = useForm();
    const context = useContext(UserContext);
    const [loader, setLoader] = useState<boolean>(false);
    const [events, setEvents] = useState<EventType[]>([]);
    const [selectedEvent, setSelectedEvent] = useState<EventType | undefined>(undefined);

    let requestBody = {
        query: `
            query {
                getEvents{
                    _id
                    title
                    description
                    price
                    date
                    creator{
                      _id
                      email
                    }
                  }
            }
        `
    };

    useEffect(() => {
        getAllEvents(requestBody);
    },[]);

    const onSubmit = (data: {
        title: string;
        description: string;
        price: number;
        date: string;
    }) => {
        const date = new Date(data.date);
        let requestBody = {
            query: `
                mutation {
                    createEvent(eventInput: {
                        title: "${data.title}", 
                        description: "${data.description}",
                        price: ${data.price},
                        date: "${date}"
                    }){
                        _id
                        title
                        description
                        date
                        price
                        creator{
                            _id
                            email
                        }
                    }
                }
            `
        }
        getAllEvents(requestBody, context.token);
      }


    const getAllEvents = async (reqBody: {
        query: string;
    }, token?: string) => {
        setLoader(true);
        try {
            console.log(token)
            const res = await fetch('http://localhost:8000/graphql', {
                method: 'POST',
                body: JSON.stringify(reqBody),
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + token
                }
            })
            if (res.status !== 200 && res.status !== 201) {
                setCreateEventModalOpen(false);
                setLoader(false);
                throw new Error('Failed!');
            }
            const resData = await Promise.resolve(res.json());
            if(!token) {
                setEvents(resData.data.getEvents);
            } else {
                setEvents(events => [...events, resData.data.createEvent])
            }
            setCreateEventModalOpen(false);
            setLoader(false);
        } catch (e) { console.log(e) };
    };

    const bookEvent = async () => {
        if(selectedEvent){
            const reqBody = {
                query: `
                    mutation {
                        bookEvent(eventId: "${selectedEvent._id}"){
                            _id
                            createdAt
                            updatedAt
                        }
                    }
                `
            };
            try {
                const res = await fetch('http://localhost:8000/graphql', {
                    method: 'POST',
                    body: JSON.stringify(reqBody),
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + context.token
                    }
                })
                if (res.status !== 200 && res.status !== 201) {
                    setSelectedEvent(undefined);
                    setBookEventModalOpen(false);
                    throw new Error('Failed!');
                }
                const resData = await Promise.resolve(res.json());
                console.log(resData);
            } catch (e) { console.log(e) };
        }
        setSelectedEvent(undefined);
        setBookEventModalOpen(false);
    }

    const formatDate = (date: string) => {
        const d = new Date(date);
            return `${d.getDate()}.${d.getMonth()}.${d.getFullYear()} 
             at: ${d.getHours()}:${d.getMinutes()}:${d.getSeconds()}`;
    }

    return(
        <>
        <div style={{display: 'flex', flex: 1, flexDirection: 'row',justifyContent:"space-between", alignContent: 'center'}}>
            <h1>Events</h1>
            <Button style={{backgroundColor: "#4bbe65", color: "white", alignSelf: 'baseline'}} onClick={() => setCreateEventModalOpen(true)}>
                Create Event
            </Button>
        </div>
        <div style={{display:'flex', flex: 1, flexDirection: 'row', flexWrap: 'wrap'}}>
        {events && events.length > 0? events.map(event => {
            
            return (
            <Card key={event._id} style={{marginRight: 10, marginTop: 10, width: 300}}>
                <Card.Content id={event._id}>
                    <Card.Header>{event.title}</Card.Header>
                    <Card.Description>
                        <label><b>Created by:</b></label>
                        <div>{event.creator.email}</div>
                        <label><b>Price:</b></label>
                        <div>{event.price}$</div>
                        <label><b>Date:</b></label>
                        <div>{formatDate(event.date)}</div>
                        <label><b>Description:</b></label>
                        <div>{event.description}</div>
                    </Card.Description>
                </Card.Content>
                <Card.Content extra>
                    <div className='ui two buttons'>
                    <Button basic color='green' onClick={() => {setSelectedEvent(event); setBookEventModalOpen(true); }}>
                        Book event
                    </Button>
                    <Button basic color='blue'>
                        Location
                    </Button>
                    </div>
                </Card.Content>
            </Card>
            )
        }) : <div>Loading...</div>
        }
        </div>
            <Modal
                onClose={() => setCreateEventModalOpen(false)}
                onOpen={() => setCreateEventModalOpen(true)}
                open={isCreateEventModalOpen}
            >
                <Modal.Header>Create Event</Modal.Header>
                <Modal.Content>
                <Form onSubmit={handleSubmit(onSubmit)} style={{ padding: 30, flexDirection: 'column' }}>
                    <FormGroup label="Name" style={{flexDirection: 'column'}}>
                    <Form.Field required>
                        <label>Title</label>
                        <input
                          type="text"
                          name="title"
                          style={{
                            width: "100%",
                            margin: "8px 0",
                            display: "inline-block"
                          }}
                          placeholder="Enter the title"
                          ref={register}
                          required
                        />
                      </Form.Field>
                      <Form.Field required>
                        <label>Price</label>
                        <input
                          type="number"
                          step="0.01"
                          name="price"
                          style={{
                            width: "100%",
                            margin: "8px 0",
                            display: "inline-block"
                          }}
                          placeholder="Enter the price"
                          ref={register}
                          required
                        />
                      </Form.Field>
                      <Form.Field required>
                        <label>Date</label>
                        <input
                          type="datetime-local"
                          name="date"
                          style={{
                              width: "100%",
                              margin: "8px 0",
                              display: "inline-block"
                          }}
                          placeholder="Enter the date"
                          ref={register}
                          required
                        />
                      </Form.Field>
                              <Form.Field required>
                                <label>Description</label>
                                <input
                                  type="text"
                                  name="description"
                                  style={{
                                    width: "100%",
                                    height: "100px",
                                    margin: "8px 0",
                                    display: "inline-block"
                                  }}
                                  placeholder="Enter the description"
                                  ref={register}
                                  required
                                />
                              </Form.Field>
                      </FormGroup>
                    <Button
                        type="button"
                        floated="right"
                        onClick={() => setCreateEventModalOpen(false)}
                    >
                        Cancel
                    </Button>
                      <Button
                        primary
                        loading={loader}
                        type="submit"
                        floated="right"
                    >
                        Create new book
                    </Button>
                </Form>
                </Modal.Content>
            </Modal>
            <Modal
                onClose={() => {setBookEventModalOpen(false); setSelectedEvent(undefined)}}
                onOpen={() => setBookEventModalOpen(true)}
                open={isBookEventModalOpen}
                size={'mini'}
            >
                <Modal.Header>{selectedEvent?.title}</Modal.Header>
                <Modal.Content>
                <p>Are you sure you want to book this event</p>
                </Modal.Content>
                <Modal.Actions>
                <Button positive onClick={() => bookEvent()}>
                    Yes
                </Button>
                <Button negative onClick={() => {setBookEventModalOpen(false); setSelectedEvent(undefined)}}>
                    No
                </Button>
                </Modal.Actions>
            </Modal>
        </>
    )
}

export default EventsPage;