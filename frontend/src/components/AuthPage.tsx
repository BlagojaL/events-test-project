import React, { useContext, useState } from "react";
import { Form, Button, Card, Grid } from "semantic-ui-react";
import { useForm } from "react-hook-form";
import { UserContext } from "./UserContext";
import { useHistory } from "react-router-dom";

const AuthPage = () => {
    const { register, handleSubmit } = useForm();
    const [isLogin, setIsLogin] = useState<boolean>(true);
    const [fetchingData, setFetchingData] = useState<boolean>(false);
    const context = useContext(UserContext);
    let history = useHistory();

    const submitForm = async (values: {
        email: string;
        password: string;
    }) => {
        if(values.email.trim().length === 0 || values.password.trim().length === 0) return;

        let requestBody = {
            query: `
                query {
                    login(email: "${values.email}", password: "${values.password}") {
                        userId
                        token
                        tokenExpire
                    }
                }
            `
        };

        if(!isLogin){
            requestBody = {
                query: `
                    mutation {
                        createUser(userInput: {email: "${values.email}", password: "${values.password}"}){
                            _id
                            email
                        }
                    }
                `
            };
        }

        try{
          setFetchingData(true);
          const res = await fetch('http://localhost:8000/graphql',{
              method: 'POST',
              body: JSON.stringify(requestBody),
              headers: {
                  'Content-Type' : 'application/json'
              }
          })
          if(res.status !== 200 && res.status !== 201){
            setFetchingData(false);
            throw new Error('Failed!');
          }
          const resData = await Promise.resolve(res.json());
          context.login(resData.data.login.userId, resData.data.login.token);
          history.push("/")
          setFetchingData(false);
        } catch (e) {console.log(e)};
    };
    
    return(
        <div>
        <Grid
          style={{
            height: "100vh",
            display: "flex",
            alignItems: "center",
            verticalAlign: "center",
            flexDirection: "column",
            flexWrap: "nowrap"
          }}
        >
          <Grid.Column computer={6} tablet={8} mobile={14}>
            <>
              <div style={{ zIndex: 1 }}>
                <Card centered fluid>
                  <Card.Content>
                    <Card.Header data-testid="CustomSignInHeader">
                      {isLogin? "Log in to your account" : "Create new account"}
                    </Card.Header>
                  </Card.Content>
                  <Card.Content>
                    <Form onSubmit={handleSubmit(submitForm)}>
                      <Form.Field required>
                        <label>Email</label>
                        <input
                          type="text"
                          name="email"
                          style={{
                            width: "100%",
                            margin: "8px 0",
                            display: "inline-block"
                          }}
                          placeholder="Enter your email"
                          ref={register}
                          required
                        />
                      </Form.Field>
                      <Form.Field required>
                        <label>Password</label>
                        <input
                          type="password"
                          name="password"
                          style={{
                            width: "100%",
                            margin: "8px 0",
                            display: "inline-block"
                          }}
                          placeholder="Enter your password"
                          ref={register}
                          required
                        />
                      </Form.Field>
                      <div style={{ display: "flex" }}>
                        <Button
                          {...{ loading: fetchingData }}
                          style={{
                            flex: 1,
                            width: "20%",
                            display: "inline-block",
                            backgroundColor: "#4bbe65",
                            color: "white",
                            marginLeft: "auto",
                            marginRight: "auto",
                            fontSize: "medium"
                          }}
                          type="submit"
                          data-testid="CustomSignInSubmitButton"
                        >
                          {isLogin? "Sign In" : "Sign Up"}
                        </Button>
                      </div>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          paddingTop: "10px"
                        }}
                      >
                        {isLogin &&
                            <div style={{ marginRight: "5px", fontSize: "14px" }}>
                            Don't have an account yet?
                            </div>
                        }
                        <div
                          style={{
                            color: "#0d1457",
                            fontSize: "14px",
                            cursor: "pointer"
                          }}
                          onClick={() => setIsLogin(!isLogin)}
                        >
                          {isLogin? "Create account" : "Go to Sign In"}
                        </div>
                      </div>
                    </Form>
                  </Card.Content>
                </Card>
              </div>
            </>
          </Grid.Column>
        </Grid>
      </div>
    )
}

export default AuthPage;