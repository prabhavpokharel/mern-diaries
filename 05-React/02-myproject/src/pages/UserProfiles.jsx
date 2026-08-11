import React, { useContext } from "react";
import PersonCard from "../components/PersonCard";
import { MyContext } from "../context/MyContext";

const UserProfiles = () => {
  const msg = useContext(MyContext);

  return (
    <>
        {msg}
        <div className="flex p-10">
            <PersonCard name="Ram" age="32" phone="9812345678" />
            <PersonCard />
            <PersonCard />
            <PersonCard />
            <PersonCard />
            <PersonCard />
        </div>
    </>
  );
};

export default UserProfiles;
