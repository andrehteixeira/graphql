import { gql, useMutation } from "@apollo/client";
import { FormEvent, useState } from "react";
import { GET_USERS } from "../App";
import { client } from "../services/apollo";

const CREATE_USER = gql`
  mutation ($name: String!) {
    createUser(name: $name) {
      id
      name
    }
  }
`;

export function NewUserFrom() {
  const [name, setName] = useState("");
  const [createUser, { data, loading, error }] = useMutation(CREATE_USER);

  async function handleCreateUser(event: FormEvent) {
    event.preventDefault();

    if (!name) {
      return;
    }

    await createUser({
      variables: {
        name,
      },
      // refetchQueries: [GET_USERS], // refetch the users query after creating a new user

      // Adiciona no cache do Apollo
      update: (cache, { data: { createUser } }) => {
        const { users } = client.readQuery({ query: GET_USERS });

        cache.writeQuery({
          query: GET_USERS,
          data: {
            users: [...users, createUser],
          },
        });
      },
    });

    setName("");
  }

  return (
    <form onSubmit={handleCreateUser}>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <button type="submit">Add user</button>
    </form>
  );
}
