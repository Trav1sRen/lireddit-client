import gql from 'graphql-tag';
import * as Urql from 'urql';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
};

export type CommentUpdoot = {
  __typename?: 'CommentUpdoot';
  user: User;
};

export type FieldError = {
  __typename?: 'FieldError';
  field: Scalars['String'];
  message: Scalars['String'];
};

export type Mutation = {
  __typename?: 'Mutation';
  changePassword: UserResponse;
  commentPost?: Maybe<PostComment>;
  createPost: Post;
  deletePost: Scalars['Boolean'];
  forgetPassword: Scalars['Boolean'];
  login: UserResponse;
  logout: Scalars['Boolean'];
  register: UserResponse;
  updatePost?: Maybe<Post>;
  vote?: Maybe<VoteResponse>;
  voteComment?: Maybe<PostComment>;
};


export type MutationChangePasswordArgs = {
  newPassword: Scalars['String'];
  uuid: Scalars['String'];
};


export type MutationCommentPostArgs = {
  postId: Scalars['Int'];
  text: Scalars['String'];
};


export type MutationCreatePostArgs = {
  input: PostInput;
};


export type MutationDeletePostArgs = {
  id: Scalars['Int'];
};


export type MutationForgetPasswordArgs = {
  email: Scalars['String'];
};


export type MutationLoginArgs = {
  password: Scalars['String'];
  usernameOrEmail: Scalars['String'];
};


export type MutationRegisterArgs = {
  input: UsernamePasswordInput;
};


export type MutationUpdatePostArgs = {
  id: Scalars['Int'];
  title?: InputMaybe<Scalars['String']>;
};


export type MutationVoteArgs = {
  postId: Scalars['Int'];
  value: Scalars['Int'];
};


export type MutationVoteCommentArgs = {
  postCommentUuid: Scalars['String'];
};

export type PaginatedPosts = {
  __typename?: 'PaginatedPosts';
  hasMore: Scalars['Boolean'];
  paginatedPosts: Array<Post>;
};

export type Post = {
  __typename?: 'Post';
  comments: Scalars['Int'];
  createdAt: Scalars['String'];
  creator: User;
  downvotes: Scalars['Int'];
  id: Scalars['Int'];
  postComments: Array<PostComment>;
  text: Scalars['String'];
  textSnippet: Scalars['String'];
  title: Scalars['String'];
  updatedAt: Scalars['String'];
  updoots: Array<Updoot>;
  upvotes: Scalars['Int'];
};

export type PostComment = {
  __typename?: 'PostComment';
  commentUpdoots: Array<CommentUpdoot>;
  createdAt: Scalars['String'];
  postCommentUuid: Scalars['String'];
  postId: Scalars['Int'];
  text: Scalars['String'];
  updatedAt: Scalars['String'];
  upvotes: Scalars['Int'];
  user: User;
};

export type PostInput = {
  text: Scalars['String'];
  title: Scalars['String'];
};

export type Query = {
  __typename?: 'Query';
  loginState?: Maybe<User>;
  post?: Maybe<Post>;
  posts: PaginatedPosts;
};


export type QueryPostArgs = {
  id: Scalars['Int'];
};


export type QueryPostsArgs = {
  cursor?: InputMaybe<Scalars['String']>;
  limit: Scalars['Int'];
};

export type Updoot = {
  __typename?: 'Updoot';
  user: User;
  vote: Scalars['Int'];
};

export type User = {
  __typename?: 'User';
  createdAt: Scalars['String'];
  email: Scalars['String'];
  id: Scalars['Int'];
  updatedAt: Scalars['String'];
  username: Scalars['String'];
};

export type UserResponse = {
  __typename?: 'UserResponse';
  errors?: Maybe<Array<FieldError>>;
  user?: Maybe<User>;
};

export type UsernamePasswordInput = {
  email: Scalars['String'];
  password: Scalars['String'];
  username: Scalars['String'];
};

export type VoteResponse = {
  __typename?: 'VoteResponse';
  post: Post;
  vote: Scalars['Int'];
};

export type ErrorFragmentFragment = { __typename?: 'FieldError', field: string, message: string };

export type PostCommentFragmentFragment = { __typename?: 'PostComment', postCommentUuid: string, text: string, createdAt: string, upvotes: number, user: { __typename?: 'User', username: string }, commentUpdoots: Array<{ __typename?: 'CommentUpdoot', user: { __typename?: 'User', id: number, username: string } }> };

export type PostFragmentFragment = { __typename?: 'Post', id: number, title: string, textSnippet: string, updatedAt: string, createdAt: string, upvotes: number, downvotes: number, creator: { __typename?: 'User', id: number, username: string }, updoots: Array<{ __typename?: 'Updoot', vote: number, user: { __typename?: 'User', id: number, username: string } }> };

export type UserFragmentFragment = { __typename?: 'User', id: number, username: string };

export type UserResponseFragmentFragment = { __typename?: 'UserResponse', user?: { __typename?: 'User', id: number, username: string } | null | undefined, errors?: Array<{ __typename?: 'FieldError', field: string, message: string }> | null | undefined };

export type ChangePasswordMutationVariables = Exact<{
  newPassword: Scalars['String'];
  uuid: Scalars['String'];
}>;


export type ChangePasswordMutation = { __typename?: 'Mutation', changePassword: { __typename?: 'UserResponse', user?: { __typename?: 'User', id: number, username: string } | null | undefined, errors?: Array<{ __typename?: 'FieldError', field: string, message: string }> | null | undefined } };

export type CommentPostMutationVariables = Exact<{
  text: Scalars['String'];
  postId: Scalars['Int'];
}>;


export type CommentPostMutation = { __typename?: 'Mutation', commentPost?: { __typename?: 'PostComment', postCommentUuid: string, text: string, createdAt: string, upvotes: number, user: { __typename?: 'User', username: string }, commentUpdoots: Array<{ __typename?: 'CommentUpdoot', user: { __typename?: 'User', id: number, username: string } }> } | null | undefined };

export type CreatePostMutationVariables = Exact<{
  input: PostInput;
}>;


export type CreatePostMutation = { __typename?: 'Mutation', createPost: { __typename?: 'Post', comments: number, id: number, title: string, textSnippet: string, updatedAt: string, createdAt: string, upvotes: number, downvotes: number, creator: { __typename?: 'User', id: number, username: string }, updoots: Array<{ __typename?: 'Updoot', vote: number, user: { __typename?: 'User', id: number, username: string } }> } };

export type ForgetPasswordMutationVariables = Exact<{
  email: Scalars['String'];
}>;


export type ForgetPasswordMutation = { __typename?: 'Mutation', forgetPassword: boolean };

export type LoginMutationVariables = Exact<{
  usernameOrEmail: Scalars['String'];
  password: Scalars['String'];
}>;


export type LoginMutation = { __typename?: 'Mutation', login: { __typename?: 'UserResponse', user?: { __typename?: 'User', id: number, username: string } | null | undefined, errors?: Array<{ __typename?: 'FieldError', field: string, message: string }> | null | undefined } };

export type LogoutMutationVariables = Exact<{ [key: string]: never; }>;


export type LogoutMutation = { __typename?: 'Mutation', logout: boolean };

export type RegisterMutationVariables = Exact<{
  input: UsernamePasswordInput;
}>;


export type RegisterMutation = { __typename?: 'Mutation', register: { __typename?: 'UserResponse', user?: { __typename?: 'User', id: number, username: string } | null | undefined, errors?: Array<{ __typename?: 'FieldError', field: string, message: string }> | null | undefined } };

export type VoteMutationVariables = Exact<{
  value: Scalars['Int'];
  postId: Scalars['Int'];
}>;


export type VoteMutation = { __typename?: 'Mutation', vote?: { __typename?: 'VoteResponse', vote: number, post: { __typename?: 'Post', id: number, upvotes: number, downvotes: number, creator: { __typename?: 'User', id: number, username: string } } } | null | undefined };

export type VoteCommentMutationVariables = Exact<{
  postCommentUuid: Scalars['String'];
}>;


export type VoteCommentMutation = { __typename?: 'Mutation', voteComment?: { __typename?: 'PostComment', postId: number, upvotes: number } | null | undefined };

export type LoginStateQueryVariables = Exact<{ [key: string]: never; }>;


export type LoginStateQuery = { __typename?: 'Query', loginState?: { __typename?: 'User', id: number, username: string } | null | undefined };

export type PostQueryVariables = Exact<{
  id: Scalars['Int'];
}>;


export type PostQuery = { __typename?: 'Query', post?: { __typename?: 'Post', text: string, comments: number, id: number, title: string, textSnippet: string, updatedAt: string, createdAt: string, upvotes: number, downvotes: number, postComments: Array<{ __typename?: 'PostComment', postCommentUuid: string, text: string, createdAt: string, upvotes: number, user: { __typename?: 'User', username: string }, commentUpdoots: Array<{ __typename?: 'CommentUpdoot', user: { __typename?: 'User', id: number, username: string } }> }>, creator: { __typename?: 'User', id: number, username: string }, updoots: Array<{ __typename?: 'Updoot', vote: number, user: { __typename?: 'User', id: number, username: string } }> } | null | undefined };

export type PostsQueryVariables = Exact<{
  limit: Scalars['Int'];
  cursor?: InputMaybe<Scalars['String']>;
}>;


export type PostsQuery = { __typename?: 'Query', posts: { __typename?: 'PaginatedPosts', hasMore: boolean, paginatedPosts: Array<{ __typename?: 'Post', comments: number, id: number, title: string, textSnippet: string, updatedAt: string, createdAt: string, upvotes: number, downvotes: number, creator: { __typename?: 'User', id: number, username: string }, updoots: Array<{ __typename?: 'Updoot', vote: number, user: { __typename?: 'User', id: number, username: string } }> }> } };

export const UserFragmentFragmentDoc = gql`
    fragment UserFragment on User {
  id
  username
}
    `;
export const PostCommentFragmentFragmentDoc = gql`
    fragment PostCommentFragment on PostComment {
  postCommentUuid
  text
  user {
    username
  }
  createdAt
  upvotes
  commentUpdoots {
    user {
      ...UserFragment
    }
  }
}
    ${UserFragmentFragmentDoc}`;
export const PostFragmentFragmentDoc = gql`
    fragment PostFragment on Post {
  id
  title
  textSnippet
  updatedAt
  createdAt
  upvotes
  downvotes
  creator {
    ...UserFragment
  }
  updoots {
    vote
    user {
      ...UserFragment
    }
  }
}
    ${UserFragmentFragmentDoc}`;
export const ErrorFragmentFragmentDoc = gql`
    fragment ErrorFragment on FieldError {
  field
  message
}
    `;
export const UserResponseFragmentFragmentDoc = gql`
    fragment UserResponseFragment on UserResponse {
  user {
    ...UserFragment
  }
  errors {
    ...ErrorFragment
  }
}
    ${UserFragmentFragmentDoc}
${ErrorFragmentFragmentDoc}`;
export const ChangePasswordDocument = gql`
    mutation ChangePassword($newPassword: String!, $uuid: String!) {
  changePassword(newPassword: $newPassword, uuid: $uuid) {
    ...UserResponseFragment
  }
}
    ${UserResponseFragmentFragmentDoc}`;

export function useChangePasswordMutation() {
  return Urql.useMutation<ChangePasswordMutation, ChangePasswordMutationVariables>(ChangePasswordDocument);
};
export const CommentPostDocument = gql`
    mutation CommentPost($text: String!, $postId: Int!) {
  commentPost(text: $text, postId: $postId) {
    ...PostCommentFragment
  }
}
    ${PostCommentFragmentFragmentDoc}`;

export function useCommentPostMutation() {
  return Urql.useMutation<CommentPostMutation, CommentPostMutationVariables>(CommentPostDocument);
};
export const CreatePostDocument = gql`
    mutation CreatePost($input: PostInput!) {
  createPost(input: $input) {
    ...PostFragment
    comments
  }
}
    ${PostFragmentFragmentDoc}`;

export function useCreatePostMutation() {
  return Urql.useMutation<CreatePostMutation, CreatePostMutationVariables>(CreatePostDocument);
};
export const ForgetPasswordDocument = gql`
    mutation ForgetPassword($email: String!) {
  forgetPassword(email: $email)
}
    `;

export function useForgetPasswordMutation() {
  return Urql.useMutation<ForgetPasswordMutation, ForgetPasswordMutationVariables>(ForgetPasswordDocument);
};
export const LoginDocument = gql`
    mutation Login($usernameOrEmail: String!, $password: String!) {
  login(usernameOrEmail: $usernameOrEmail, password: $password) {
    ...UserResponseFragment
  }
}
    ${UserResponseFragmentFragmentDoc}`;

export function useLoginMutation() {
  return Urql.useMutation<LoginMutation, LoginMutationVariables>(LoginDocument);
};
export const LogoutDocument = gql`
    mutation Logout {
  logout
}
    `;

export function useLogoutMutation() {
  return Urql.useMutation<LogoutMutation, LogoutMutationVariables>(LogoutDocument);
};
export const RegisterDocument = gql`
    mutation Register($input: UsernamePasswordInput!) {
  register(input: $input) {
    ...UserResponseFragment
  }
}
    ${UserResponseFragmentFragmentDoc}`;

export function useRegisterMutation() {
  return Urql.useMutation<RegisterMutation, RegisterMutationVariables>(RegisterDocument);
};
export const VoteDocument = gql`
    mutation Vote($value: Int!, $postId: Int!) {
  vote(value: $value, postId: $postId) {
    vote
    post {
      id
      creator {
        ...UserFragment
      }
      upvotes
      downvotes
    }
  }
}
    ${UserFragmentFragmentDoc}`;

export function useVoteMutation() {
  return Urql.useMutation<VoteMutation, VoteMutationVariables>(VoteDocument);
};
export const VoteCommentDocument = gql`
    mutation VoteComment($postCommentUuid: String!) {
  voteComment(postCommentUuid: $postCommentUuid) {
    postId
    upvotes
  }
}
    `;

export function useVoteCommentMutation() {
  return Urql.useMutation<VoteCommentMutation, VoteCommentMutationVariables>(VoteCommentDocument);
};
export const LoginStateDocument = gql`
    query LoginState {
  loginState {
    ...UserFragment
  }
}
    ${UserFragmentFragmentDoc}`;

export function useLoginStateQuery(options: Omit<Urql.UseQueryArgs<LoginStateQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<LoginStateQuery>({ query: LoginStateDocument, ...options });
};
export const PostDocument = gql`
    query Post($id: Int!) {
  post(id: $id) {
    ...PostFragment
    postComments {
      ...PostCommentFragment
    }
    text
    comments
  }
}
    ${PostFragmentFragmentDoc}
${PostCommentFragmentFragmentDoc}`;

export function usePostQuery(options: Omit<Urql.UseQueryArgs<PostQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<PostQuery>({ query: PostDocument, ...options });
};
export const PostsDocument = gql`
    query Posts($limit: Int!, $cursor: String) {
  posts(limit: $limit, cursor: $cursor) {
    paginatedPosts {
      ...PostFragment
      comments
    }
    hasMore
  }
}
    ${PostFragmentFragmentDoc}`;

export function usePostsQuery(options: Omit<Urql.UseQueryArgs<PostsQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<PostsQuery>({ query: PostsDocument, ...options });
};