import React, { useState  } from 'react'
import {  VStack ,FormControl , FormLabel, Input , InputGroup
     ,InputRightElement ,Button} from '@chakra-ui/react'
import { useToast } from '@chakra-ui/react'
import axios from "axios";
import { useHistory } from "react-router-dom"

const Signup = () => {
    const [show, setShow] = useState(false)
    const [name, setName] = useState();
    const [email, setEmail] = useState();
    const [confirmpassword, setConfirmpassword] = useState();
    const [password, setPassword] = useState();
    const [pic, setPic] = useState();
    const [loading, setLoading] = useState(false);
    const toast = useToast();
    const history = useHistory();
    //CLOUDINARY_URL=cloudinary://552547694568882:66cc1VdfA3p3WluqTb86aDQgiZk@dfph77wsr

    const handleClick = () => setShow(!show);
    const postDetails = (pics) => {
        setLoading(true);
        if (pics === undefined) {
            toast({
                title: 'Please Select an Image!',
                description: "",
                status: 'warning',
                duration: 5000,
                isClosable: true,
              });
              return;
        }

        if (pics.type === "image/jpeg" || pics.type === "image/png"){
            const data = new FormData();
            data.append("file",pics);
            data.append("upload_preset" , "chat-app");
            data.append("cloud_name" ,"dfph77wsr")
            fetch("https://api.cloudinary.com/v1_1/dfph77wsr/image/upload",{
                method: "post" ,
                body: data,
            }).then((res) => res.json())
            .then(data => {
                setPic(data.url.toString());
                console.log(data.url.toString());
                setLoading(false);
            })
            .catch((err) => {
                console.log(err);
                setLoading(false);
            });
        } else {
            toast({
                title: 'Please Select an Image!',
                description: "",
                status: 'warning',
                duration: 5000,
                isClosable: true,
              });
              setLoading(false);
              return;
        }

    };
    const submitHandler = async() => {
        setLoading(true);
        if(!name  || !email || !password || !confirmpassword){
            toast({
                title: 'Please Fill all the Feilds',
                description: "",
                status: 'warning',
                duration: 5000,
                isClosable: true,
              });
              setLoading(false);
              return;
        }
         if(password !== confirmpassword){
            toast({
                title: 'Password Do Not Match',
                description: "",
                status: 'warning',
                duration: 5000,
                isClosable: true,
              });
              return;
         }


         try {
            const config = {
                headers: {
                    "Content-type": "application/json",
                },
            };
            const { data } = await axios.post(
                "/api/user",
                {name,email,password,pic},
                config
            );
            toast({
                title: 'Registration Successful',
                description: "",
                status: 'success',
                duration: 5000,
                isClosable: true,
              });

              localStorage.setItem("userInfo", JSON.stringify(data));

              setLoading(false);
              history.push("/chats");

         } catch (error) {
            toast({
                title: 'Error Occured!',
                description: error.response.data.message,
                status: 'error',
                duration: 5000,
                isClosable: true,
              });
              setLoading(false);
         }

    };

  return (
    <VStack spacing="5px" color={"black"}>


    {/* Name */}
    <FormControl id='first-name' isRequired>
        <FormLabel>Name</FormLabel>
            <Input
                placeholder='Enter Your Name'
                onChange={(e)=>setName(e.target.value)}
            />
        
    </FormControl>


    {/* email */}
    <FormControl id='Email' isRequired>
        <FormLabel>Email</FormLabel>
            <Input
                placeholder='Enter Your Email'
                onChange={(e)=>setEmail(e.target.value)}
            />
        
    </FormControl>


    {/* password */}
    <FormControl id='password' isRequired>
        <FormLabel>Password</FormLabel>
        <InputGroup>
            <Input
                type={ show ? "text" : "password" }
                placeholder='Enter Your Password'
                onChange={(e)=>setPassword(e.target.value)}
            />
            <InputRightElement width={"4.5rem"}>
            <Button h={"1.75rem"} size={"sm"} onClick={handleClick}>
                {show ? "hide" : "show"}
            </Button>
            </InputRightElement>
        </InputGroup>
    </FormControl>


    {/* confirmpassword */}
    <FormControl id='password' isRequired>
        <FormLabel>Confirm Password</FormLabel>
        <InputGroup>
            <Input
                type={ show ? "text" : "password" }
                placeholder='Confirm Password'
                onChange={(e)=>setConfirmpassword(e.target.value)}
            />
            <InputRightElement width={"4.5rem"}>
            <Button h={"1.75rem"} size={"sm"} onClick={handleClick}>
                {show ? "hide" : "show"}
            </Button>
            </InputRightElement>
        </InputGroup>
    </FormControl>


    {/* pic */}
    <FormControl id='pic' isRequired>
        <FormLabel>Upload Your Picture</FormLabel>
            <Input
            type="file"
            p={1.5}
            accept="image/*"
            onChange={(e)=>postDetails(e.target.files[0])}
            />
        
    </FormControl>


    <Button colorScheme="blue" 
            width={"100%"} 
            style={{marginTop:15}} 
            onClick={submitHandler}
            isLoading={loading}
            >
        Sign Up
    </Button>

    </VStack>
  )
}

export default Signup;