import gql from 'graphql-tag';
import * as ApolloReactCommon from '@apollo/client';
import * as ApolloReactHooks from '@apollo/client';
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: any }> = { [K in keyof T]: T[K] };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  /**
   * A date-time string at UTC, such as 2007-12-03T10:15:30Z, compliant with the
   * `date-time` format outlined in section 5.6 of the RFC 3339 profile of the ISO
   * 8601 standard for representation of dates and times using the Gregorian calendar.
   */
  DateTime: any;
  /** The `JSON` scalar type represents JSON objects as specified by [ECMA-404](http://www.ecma-international.org/publications/files/ECMA-ST/ECMA-404.pdf). */
  Json: any;
};

/** Payload returned if login or signup is successful */
export type AuthPayload = {
  __typename?: 'AuthPayload';
  /** The current JWT token. Use in Authentication header */
  token?: Maybe<Scalars['String']>;
  /** The logged in user */
  user?: Maybe<User>;
};

export type DateTimeFilter = {
  equals?: Maybe<Scalars['DateTime']>;
  gt?: Maybe<Scalars['DateTime']>;
  gte?: Maybe<Scalars['DateTime']>;
  in?: Maybe<Array<Scalars['DateTime']>>;
  lt?: Maybe<Scalars['DateTime']>;
  lte?: Maybe<Scalars['DateTime']>;
  not?: Maybe<Scalars['DateTime']>;
  notIn?: Maybe<Array<Scalars['DateTime']>>;
};

export type Mutation = {
  __typename?: 'Mutation';
  createUser: User;
  /** Login to an existing account */
  login?: Maybe<AuthPayload>;
  /** Signup for an account */
  signup?: Maybe<AuthPayload>;
};

export type MutationCreateUserArgs = {
  data: UserCreateInput;
};

export type MutationLoginArgs = {
  email: Scalars['String'];
  password: Scalars['String'];
};

export type MutationSignupArgs = {
  data: SignupInput;
};

export enum OrderByArg {
  ASC = 'asc',
  DESC = 'desc',
}

/** A User Profile */
export type Profile = {
  __typename?: 'Profile';
  createdAt: Scalars['DateTime'];
  firstName: Scalars['String'];
  /** The first and last name of a user */
  fullName?: Maybe<Scalars['String']>;
  id: Scalars['String'];
  lastName: Scalars['String'];
  updatedAt: Scalars['DateTime'];
  user: User;
};

export type ProfileCreateOneWithoutUserInput = {
  connect?: Maybe<ProfileWhereUniqueInput>;
  create?: Maybe<ProfileCreateWithoutUserInput>;
};

export type ProfileCreateWithoutUserInput = {
  createdAt?: Maybe<Scalars['DateTime']>;
  firstName: Scalars['String'];
  id?: Maybe<Scalars['String']>;
  lastName: Scalars['String'];
  updatedAt?: Maybe<Scalars['DateTime']>;
};

export type ProfileWhereInput = {
  AND?: Maybe<Array<ProfileWhereInput>>;
  createdAt?: Maybe<DateTimeFilter>;
  firstName?: Maybe<StringFilter>;
  id?: Maybe<StringFilter>;
  lastName?: Maybe<StringFilter>;
  NOT?: Maybe<Array<ProfileWhereInput>>;
  OR?: Maybe<Array<ProfileWhereInput>>;
  updatedAt?: Maybe<DateTimeFilter>;
  user?: Maybe<UserWhereInput>;
  userId?: Maybe<StringFilter>;
};

export type ProfileWhereUniqueInput = {
  id?: Maybe<Scalars['String']>;
};

export type Query = {
  __typename?: 'Query';
  /** Returns the currently logged in user */
  me?: Maybe<User>;
  user?: Maybe<User>;
  users: Array<User>;
};

export type QueryUserArgs = {
  where: UserWhereUniqueInput;
};

export type QueryUsersArgs = {
  after?: Maybe<UserWhereUniqueInput>;
  before?: Maybe<UserWhereUniqueInput>;
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<UserOrderByInput>;
  where?: Maybe<UserWhereInput>;
};

export enum Role {
  ADMIN = 'ADMIN',
  USER = 'USER',
}

export type SignupInput = {
  email: Scalars['String'];
  password: Scalars['String'];
  profile?: Maybe<ProfileCreateOneWithoutUserInput>;
};

export type StringFilter = {
  contains?: Maybe<Scalars['String']>;
  endsWith?: Maybe<Scalars['String']>;
  equals?: Maybe<Scalars['String']>;
  gt?: Maybe<Scalars['String']>;
  gte?: Maybe<Scalars['String']>;
  in?: Maybe<Array<Scalars['String']>>;
  lt?: Maybe<Scalars['String']>;
  lte?: Maybe<Scalars['String']>;
  not?: Maybe<Scalars['String']>;
  notIn?: Maybe<Array<Scalars['String']>>;
  startsWith?: Maybe<Scalars['String']>;
};

/** A User */
export type User = {
  __typename?: 'User';
  createdAt: Scalars['DateTime'];
  email?: Maybe<Scalars['String']>;
  id: Scalars['String'];
  profile?: Maybe<Profile>;
  roles: Array<Role>;
  updatedAt: Scalars['DateTime'];
};

export type UserCreateInput = {
  createdAt?: Maybe<Scalars['DateTime']>;
  email: Scalars['String'];
  id?: Maybe<Scalars['String']>;
  password: Scalars['String'];
  profile?: Maybe<ProfileCreateOneWithoutUserInput>;
  roles?: Maybe<UserCreaterolesInput>;
  updatedAt?: Maybe<Scalars['DateTime']>;
};

export type UserCreaterolesInput = {
  set?: Maybe<Array<Role>>;
};

export type UserOrderByInput = {
  createdAt?: Maybe<OrderByArg>;
  email?: Maybe<OrderByArg>;
  id?: Maybe<OrderByArg>;
  password?: Maybe<OrderByArg>;
  updatedAt?: Maybe<OrderByArg>;
};

export type UserWhereInput = {
  AND?: Maybe<Array<UserWhereInput>>;
  createdAt?: Maybe<DateTimeFilter>;
  email?: Maybe<StringFilter>;
  id?: Maybe<StringFilter>;
  NOT?: Maybe<Array<UserWhereInput>>;
  OR?: Maybe<Array<UserWhereInput>>;
  password?: Maybe<StringFilter>;
  profile?: Maybe<ProfileWhereInput>;
  updatedAt?: Maybe<DateTimeFilter>;
};

export type UserWhereUniqueInput = {
  email?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['String']>;
};

export type LoginMutationVariables = Exact<{
  email: Scalars['String'];
  password: Scalars['String'];
}>;

export type LoginMutation = { __typename?: 'Mutation' } & {
  login?: Maybe<{ __typename?: 'AuthPayload' } & Pick<AuthPayload, 'token'>>;
};

export type SignupMutationVariables = Exact<{
  data: SignupInput;
}>;

export type SignupMutation = { __typename?: 'Mutation' } & {
  signup?: Maybe<
    { __typename?: 'AuthPayload' } & Pick<AuthPayload, 'token'> & {
        user?: Maybe<{ __typename?: 'User' } & Pick<User, 'id'>>;
      }
  >;
};

export type MeQueryVariables = Exact<{ [key: string]: never }>;

export type MeQuery = { __typename?: 'Query' } & {
  me?: Maybe<{ __typename?: 'User' } & Pick<User, 'id' | 'email'>>;
};

export const LoginDocument = gql`
  mutation login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
    }
  }
`;
export type LoginMutationFn = ApolloReactCommon.MutationFunction<
  LoginMutation,
  LoginMutationVariables
>;

/**
 * __useLoginMutation__
 *
 * To run a mutation, you first call `useLoginMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useLoginMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [loginMutation, { data, loading, error }] = useLoginMutation({
 *   variables: {
 *      email: // value for 'email'
 *      password: // value for 'password'
 *   },
 * });
 */
export function useLoginMutation(
  baseOptions?: ApolloReactHooks.MutationHookOptions<LoginMutation, LoginMutationVariables>
) {
  return ApolloReactHooks.useMutation<LoginMutation, LoginMutationVariables>(
    LoginDocument,
    baseOptions
  );
}

export type LoginMutationHookResult = ReturnType<typeof useLoginMutation>;
export type LoginMutationResult = ApolloReactCommon.MutationResult<LoginMutation>;
export type LoginMutationOptions = ApolloReactCommon.BaseMutationOptions<
  LoginMutation,
  LoginMutationVariables
>;
export const SignupDocument = gql`
  mutation signup($data: SignupInput!) {
    signup(data: $data) {
      token
      user {
        id
      }
    }
  }
`;
export type SignupMutationFn = ApolloReactCommon.MutationFunction<
  SignupMutation,
  SignupMutationVariables
>;

/**
 * __useSignupMutation__
 *
 * To run a mutation, you first call `useSignupMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSignupMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [signupMutation, { data, loading, error }] = useSignupMutation({
 *   variables: {
 *      data: // value for 'data'
 *   },
 * });
 */
export function useSignupMutation(
  baseOptions?: ApolloReactHooks.MutationHookOptions<SignupMutation, SignupMutationVariables>
) {
  return ApolloReactHooks.useMutation<SignupMutation, SignupMutationVariables>(
    SignupDocument,
    baseOptions
  );
}

export type SignupMutationHookResult = ReturnType<typeof useSignupMutation>;
export type SignupMutationResult = ApolloReactCommon.MutationResult<SignupMutation>;
export type SignupMutationOptions = ApolloReactCommon.BaseMutationOptions<
  SignupMutation,
  SignupMutationVariables
>;
export const MeDocument = gql`
  query me {
    me {
      id
      email
    }
  }
`;

/**
 * __useMeQuery__
 *
 * To run a query within a React component, call `useMeQuery` and pass it any options that fit your needs.
 * When your component renders, `useMeQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useMeQuery({
 *   variables: {
 *   },
 * });
 */
export function useMeQuery(
  baseOptions?: ApolloReactHooks.QueryHookOptions<MeQuery, MeQueryVariables>
) {
  return ApolloReactHooks.useQuery<MeQuery, MeQueryVariables>(MeDocument, baseOptions);
}

export function useMeLazyQuery(
  baseOptions?: ApolloReactHooks.LazyQueryHookOptions<MeQuery, MeQueryVariables>
) {
  return ApolloReactHooks.useLazyQuery<MeQuery, MeQueryVariables>(MeDocument, baseOptions);
}

export type MeQueryHookResult = ReturnType<typeof useMeQuery>;
export type MeLazyQueryHookResult = ReturnType<typeof useMeLazyQuery>;
export type MeQueryResult = ApolloReactCommon.QueryResult<MeQuery, MeQueryVariables>;
