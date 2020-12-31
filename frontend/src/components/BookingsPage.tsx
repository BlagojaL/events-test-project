import { Table } from 'antd';
import React, { useContext, useEffect, useState } from 'react';
import { EventType } from './EventsPage';
import { UserContext } from './UserContext';
import { SyncOutlined } from "@ant-design/icons";
import { Button, Icon, Modal } from 'semantic-ui-react';

export type BookingsType = {
    _id: any;
    event: EventType;
    user: {
        _id: string;
        email: string;
    };
    createdAt: string;
    updatedAt: string;
}

const BookingsPage = () => {
    const context = useContext(UserContext);
    const [bookings, setBookings] = useState<BookingsType[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [isModalOpen, setModalOpen] = useState<boolean>(false);

    let requestBody = {
        query: `
            query {
                getBookings{
                    _id
                    event{
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
                    user{
                        _id
                        email
                    }
                    createdAt
                    updatedAt
                }
            }
        `
    };

    const deleteBooking = async (bookingId: any) => {
        console.log(bookingId);
        let reqBody = {
            query: `
                mutation {
                    cancelBooking(bookingId: "${bookingId}"){
                        _id
                        title
                        creator{
                            _id
                            email
                        }
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
                setLoading(false);
                throw new Error('Failed!');
            }
            const resData = await Promise.resolve(res.json());
            console.log(resData);
        } catch (e) { console.log(e) };
    }

    const getBookings = async () => {
        setLoading(true);
        try {
            const res = await fetch('http://localhost:8000/graphql', {
                method: 'POST',
                body: JSON.stringify(requestBody),
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + context.token
                }
            })
            if (res.status !== 200 && res.status !== 201) {
                setLoading(false);
                throw new Error('Failed!');
            }
            const resData = await Promise.resolve(res.json());
            setBookings(resData.data.getBookings);
            setLoading(false);
        } catch (e) { console.log(e) };
    };

    useEffect(() => {
        getBookings();
    },[])


    return(
        <>
            <h1>Bookings</h1>
            <Table
                dataSource={bookings}
                rowKey={item => item._id}
                loading={loading}
                pagination={false}
                size="small"
            >
                <Table.Column
                    title={"Event"}
                    key={"event"}
                    render={(item: BookingsType) => item.event.title}
                />
                <Table.Column
                    title={"Price"}
                    key={"price"}
                    render={(item: BookingsType) => '$'+item.event.price}
                />
                <Table.Column
                    title={"Created By"}
                    key={"createdBy"}
                    render={(item: BookingsType) => item.event.creator.email}
                />
                <Table.Column
                    title={"Description"}
                    key={"description"}
                    render={(item: BookingsType) => item.event.description}
                />
                <Table.Column
                    title={"Created At"}
                    key={"createdAt"}
                    render={(item: BookingsType) => item.createdAt}
                />
                <Table.Column
                    width={35}
                    title={
                        <SyncOutlined
                            spin={loading}
                            onClick={() => getBookings()}
                            style={{ color: "#78B8F0", flex: 1, alignContent: "center" }}
                        />
                    }
                    align={"center"}
                    render={(item: BookingsType) =>(
                                <Modal
                                    trigger={<Icon name="trash" />}
                                    onClose={() => { setModalOpen(false); }}
                                    onOpen={() => setModalOpen(true)}
                                    open={isModalOpen}
                                    size={'mini'}
                                    key={item._id}
                                >
                                    <Modal.Header>{item?.event.title}</Modal.Header>
                                    <Modal.Content>
                                        <p>Are you sure you want to cancel this booking</p>
                                    </Modal.Content>
                                    <Modal.Actions>
                                        <Button negative onClick={() => deleteBooking(item._id)}>
                                            Delete
                                        </Button>
                                        <Button onClick={() => { setModalOpen(false); }}>
                                            Cancel
                                        </Button>
                                    </Modal.Actions>
                                </Modal>
                    )}
                />
            </Table>
        </>
    )
}

export default BookingsPage;