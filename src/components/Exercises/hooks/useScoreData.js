import { gql, useMutation, useQuery } from "@apollo/client";
import useLocalStorage from "../../../hooks/useLocalStorage";

const GET_USER_SCORE = gql`
  query Score($userEmail: String!) {
    score(userEmail: $userEmail) {
      userEmail
      score
    }
  }
`;

const UPDATE_USER_SCORE = gql`
  mutation UpdateScore($score: ScoreInput!) {
    updateScore(score: $score) {
      score
      userEmail
    }
  }
`;

const useGetScore = ({ user }) => {
  const { data, loading } = useQuery(GET_USER_SCORE, {
    variables: {
      userEmail: user.userEmail,
    },
  });
  return { score: data, scoreLoading: loading };
};

const useExerciseData = () => {
  const { getItem } = useLocalStorage();
  const user = getItem("user");
  const { score, scoreLoading } = useGetScore({ user });
  const [updateScore] = useMutation(UPDATE_USER_SCORE, {
    refetchQueries: ["Score", "TranslatedWords", "RandomWord"],
  });

  return {
    score: scoreLoading ? undefined : score,
    loading: scoreLoading,
    updateScore: (newScore) =>
      updateScore({
        variables: {
          score: {
            userEmail: user.userEmail,
            score: newScore,
          },
        },
      }),
  };
};

export default useExerciseData;
