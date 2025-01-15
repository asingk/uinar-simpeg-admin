import React, { useContext } from 'react'
import { AppAside, AppContent, AppSidebar, AppFooter, AppHeader } from '../components/index'
import { useNavigate } from 'react-router-dom'
import { KeycloakContext } from 'src/context'
import { ApolloClient, ApolloProvider, createHttpLink, InMemoryCache } from '@apollo/client'
import { setContext } from '@apollo/client/link/context'

const DefaultLayout = () => {
  const navigate = useNavigate()
  const keycloak = useContext(KeycloakContext)
  if (keycloak && !keycloak.resourceAccess['simpeg-admin']) {
    navigate('/500')
  }
  const httpLink = createHttpLink({
    uri: import.meta.env.VITE_GRAPH_SIMPEG_URL,
  })

  const authLink = setContext((_, { headers }) => {
    return {
      headers: {
        ...headers,
        authorization: `Bearer ${keycloak.token}`,
      },
    }
  })

  const client = new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache(),
  })
  return (
    <ApolloProvider client={client}>
      <AppSidebar />
      <div className="wrapper d-flex flex-column min-vh-100">
        <AppHeader />
        <div className="body flex-grow-1">
          <AppContent />
        </div>
        <AppFooter />
      </div>
      <AppAside />
    </ApolloProvider>
  )
}

export default DefaultLayout
