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

export type FieldError = {
  __typename?: 'FieldError';
  field: Scalars['String'];
  message: Scalars['String'];
};

export type Mutation = {
  __typename?: 'Mutation';
  changePassword: UserResponse;
  commentPost: Scalars['Boolean'];
  createPost: Scalars['Boolean'];
  deletePost: Scalars['Boolean'];
  forgetPassword: Scalars['Boolean'];
  login: UserResponse;
  logout: Scalars['Boolean'];
  register: UserResponse;
  updatePost: Scalars['Boolean'];
  vote: Scalars['Boolean'];
  voteComment: Scalars['Boolean'];
};


export type MutationChangePasswordArgs = {
  newPassword: Scalars['String'];
  uuid: Scalars['String'];
};


export type MutationCommentPostArgs = {
  postUuid: Scalars['String'];
  text: Scalars['String'];
};


export type MutationCreatePostArgs = {
  input: PostInput;
};


export type MutationDeletePostArgs = {
  postUuid: Scalars['String'];
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
  postUuid: Scalars['String'];
  text?: InputMaybe<Scalars['String']>;
  title?: InputMaybe<Scalars['String']>;
};


export type MutationVoteArgs = {
  postUuid: Scalars['String'];
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
  commentUpdootStatus: Scalars['Int'];
  comments: Scalars['Int'];
  createdAt: Scalars['String'];
  downvotes: Scalars['Int'];
  postComments: Array<PostComment>;
  postUuid: Scalars['String'];
  text: Scalars['String'];
  textSnippet: Scalars['String'];
  title: Scalars['String'];
  updatedAt: Scalars['String'];
  updootStatus: Scalars['Int'];
  upvotes: Scalars['Int'];
  user: User;
};

export type PostComment = {
  __typename?: 'PostComment';
  commentUpdootStatus: Scalars['Int'];
  createdAt: Scalars['String'];
  postCommentUuid: Scalars['String'];
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
  post: Post;
  posts: PaginatedPosts;
};


export type QueryPostArgs = {
  postUuid: Scalars['String'];
};


export type QueryPostsArgs = {
  cursor?: InputMaybe<Scalars['String']>;
  limit: Scalars['Int'];
};

export type User = {
  __typename?: 'User';
  createdAt: Scalars['String'];
  email: Scalars['String'];
  updatedAt: Scalars['String'];
  userUuid: Scalars['String'];
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

export type ErrorFragment = { __typename?: 'FieldError', field: string, message: string };

export type PostFragment = { __typename?: 'Post', postUuid: string, title: string, updatedAt: string, createdAt: string, upvotes: number, downvotes: number, updootStatus: number, user: { __typename?: 'User', userUuid: string, username: string } };

export type PostCommentFragment = { __typename?: 'PostComment', postCommentUuid: string, text: string, createdAt: string, upvotes: number, commentUpdootStatus: number, user: { __typename?: 'User', username: string } };

export type UserFragment = { __typename?: 'User', userUuid: string, username: string };

export type UserResponseFragment = { __typename?: 'UserResponse', user?: { __typename?: 'User', userUuid: string, username: string } | null | undefined, errors?: Array<{ __typename?: 'FieldError', field: string, message: string }> | null | undefined };

export type ChangePasswordMutationVariables = Exact<{
  newPassword: Scalars['String'];
  uuid: Scalars['String'];
}>;


export type ChangePasswordMutation = { __typename?: 'Mutation', changePassword: { __typename?: 'UserResponse', user?: { __typename?: 'User', userUuid: string, username: string } | null | undefined, errors?: Array<{ __typename?: 'FieldError', field: string, message: string }> | null | undefined } };

export type CommentPostMutationVariables = Exact<{
  text: Scalars['String'];
  postUuid: Scalars['String'];
}>;


export type CommentPostMutation = { __typename?: 'Mutation', commentPost: boolean };

export type CreatePostMutationVariables = Exact<{
  input: PostInput;
}>;


export type CreatePostMutation = { __typename?: 'Mutation', createPost: boolean };

export type DeletePostMutationVariables = Exact<{
  postUuid: Scalars['String'];
}>;


export type DeletePostMutation = { __typename?: 'Mutation', deletePost: boolean };

export type ForgetPasswordMutationVariables = Exact<{
  email: Scalars['String'];
}>;


export type ForgetPasswordMutation = { __typename?: 'Mutation', forgetPassword: boolean };

export type LoginMutationVariables = Exact<{
  usernameOrEmail: Scalars['String'];
  password: Scalars['String'];
}>;


export type LoginMutation = { __typename?: 'Mutation', login: { __typename?: 'UserResponse', user?: { __typename?: 'User', userUuid: string, username: string } | null | undefined, errors?: Array<{ __typename?: 'FieldError', field: string, message: string }> | null | undefined } };

export type LogoutMutationVariables = Exact<{ [key: string]: never; }>;


export type LogoutMutation = { __typename?: 'Mutation', logout: boolean };

export type RegisterMutationVariables = Exact<{
  input: UsernamePasswordInput;
}>;


export type RegisterMutation = { __typename?: 'Mutation', register: { __typename?: 'UserResponse', user?: { __typename?: 'User', userUuid: string, username: string } | null | undefined, errors?: Array<{ __typename?: 'FieldError', field: string, message: string }> | null | undefined } };

export type UpdatePostMutationVariables = Exact<{
  postUuid: Scalars['String'];
  title?: InputMaybe<Scalars['String']>;
  text?: InputMaybe<Scalars['String']>;
}>;


export type UpdatePostMutation = { __typename?: 'Mutation', updatePost: boolean };

export type VoteMutationVariables = Exact<{
  value: Scalars['Int'];
  postUuid: Scalars['String'];
}>;


export type VoteMutation = { __typename?: 'Mutation', vote: boolean };

export type VoteCommentMutationVariables = Exact<{
  postCommentUuid: Scalars['String'];
}>;


export type VoteCommentMutation = { __typename?: 'Mutation', voteComment: boolean };

export type LoginStateQueryVariables = Exact<{ [key: string]: never; }>;


export type LoginStateQuery = { __typename?: 'Query', loginState?: { __typename?: 'User', userUuid: string, username: string } | null | undefined };

export type PostQueryVariables = Exact<{
  postUuid: Scalars['String'];
}>;


export type PostQuery = { __typename?: 'Query', post: { __typename?: 'Post', text: string, comments: number, postUuid: string, title: string, updatedAt: string, createdAt: string, upvotes: number, downvotes: number, updootStatus: number, postComments: Array<{ __typename?: 'PostComment', postCommentUuid: string, text: string, createdAt: string, upvotes: number, commentUpdootStatus: number, user: { __typename?: 'User', username: string } }>, user: { __typename?: 'User', userUuid: string, username: string } } };

export type PostsQueryVariables = Exact<{
  limit: Scalars['Int'];
  cursor?: InputMaybe<Scalars['String']>;
}>;


export type PostsQuery = { __typename?: 'Query', posts: { __typename?: 'PaginatedPosts', hasMore: boolean, paginatedPosts: Array<{ __typename?: 'Post', textSnippet: string, comments: number, postUuid: string, title: string, updatedAt: string, createdAt: string, upvotes: number, downvotes: number, updootStatus: number, user: { __typename?: 'User', userUuid: string, username: string } }> } };

export const UserFragmentDoc = gql`
    fragment User on User {
  userUuid
  username
}
    `;
export const PostFragmentDoc = gql`
    fragment Post on Post {
  postUuid
  title
  updatedAt
  createdAt
  upvotes
  downvotes
  user {
    ...User
  }
  updootStatus
}
    ${UserFragmentDoc}`;
export const PostCommentFragmentDoc = gql`
    fragment PostComment on PostComment {
  postCommentUuid
  text
  user {
    username
  }
  createdAt
  upvotes
  commentUpdootStatus
}
    `;
export const ErrorFragmentDoc = gql`
    fragment Error on FieldError {
  field
  message
}
    `;
export const UserResponseFragmentDoc = gql`
    fragment UserResponse on UserResponse {
  user {
    ...User
  }
  errors {
    ...Error
  }
}
    ${UserFragmentDoc}
${ErrorFragmentDoc}`;
export const ChangePasswordDocument = gql`
    mutation ChangePassword($newPassword: String!, $uuid: String!) {
  changePassword(newPassword: $newPassword, uuid: $uuid) {
    ...UserResponse
  }
}
    ${UserResponseFragmentDoc}`;

export function useChangePasswordMutation() {
  return Urql.useMutation<ChangePasswordMutation, ChangePasswordMutationVariables>(ChangePasswordDocument);
};
export const CommentPostDocument = gql`
    mutation CommentPost($text: String!, $postUuid: String!) {
  commentPost(text: $text, postUuid: $postUuid)
}
    `;

export function useCommentPostMutation() {
  return Urql.useMutation<CommentPostMutation, CommentPostMutationVariables>(CommentPostDocument);
};
export const CreatePostDocument = gql`
    mutation CreatePost($input: PostInput!) {
  createPost(input: $input)
}
    `;

export function useCreatePostMutation() {
  return Urql.useMutation<CreatePostMutation, CreatePostMutationVariables>(CreatePostDocument);
};
export const DeletePostDocument = gql`
    mutation DeletePost($postUuid: String!) {
  deletePost(postUuid: $postUuid)
}
    `;

export function useDeletePostMutation() {
  return Urql.useMutation<DeletePostMutation, DeletePostMutationVariables>(DeletePostDocument);
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
    ...UserResponse
  }
}
    ${UserResponseFragmentDoc}`;

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
    ...UserResponse
  }
}
    ${UserResponseFragmentDoc}`;

export function useRegisterMutation() {
  return Urql.useMutation<RegisterMutation, RegisterMutationVariables>(RegisterDocument);
};
export const UpdatePostDocument = gql`
    mutation UpdatePost($postUuid: String!, $title: String, $text: String) {
  updatePost(postUuid: $postUuid, title: $title, text: $text)
}
    `;

export function useUpdatePostMutation() {
  return Urql.useMutation<UpdatePostMutation, UpdatePostMutationVariables>(UpdatePostDocument);
};
export const VoteDocument = gql`
    mutation Vote($value: Int!, $postUuid: String!) {
  vote(value: $value, postUuid: $postUuid)
}
    `;

export function useVoteMutation() {
  return Urql.useMutation<VoteMutation, VoteMutationVariables>(VoteDocument);
};
export const VoteCommentDocument = gql`
    mutation VoteComment($postCommentUuid: String!) {
  voteComment(postCommentUuid: $postCommentUuid)
}
    `;

export function useVoteCommentMutation() {
  return Urql.useMutation<VoteCommentMutation, VoteCommentMutationVariables>(VoteCommentDocument);
};
export const LoginStateDocument = gql`
    query LoginState {
  loginState {
    ...User
  }
}
    ${UserFragmentDoc}`;

export function useLoginStateQuery(options: Omit<Urql.UseQueryArgs<LoginStateQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<LoginStateQuery>({ query: LoginStateDocument, ...options });
};
export const PostDocument = gql`
    query Post($postUuid: String!) {
  post(postUuid: $postUuid) {
    ...Post
    text
    postComments {
      ...PostComment
    }
    comments
  }
}
    ${PostFragmentDoc}
${PostCommentFragmentDoc}`;

export function usePostQuery(options: Omit<Urql.UseQueryArgs<PostQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<PostQuery>({ query: PostDocument, ...options });
};
export const PostsDocument = gql`
    query Posts($limit: Int!, $cursor: String) {
  posts(limit: $limit, cursor: $cursor) {
    paginatedPosts {
      ...Post
      textSnippet
      comments
    }
    hasMore
  }
}
    ${PostFragmentDoc}`;

export function usePostsQuery(options: Omit<Urql.UseQueryArgs<PostsQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<PostsQuery>({ query: PostsDocument, ...options });
};