import React, { Component } from 'react'
import { getFilteredProducts } from 'api/API'
import { Paginate, CardGroup, Spinner } from 'components/common/index'
// import { withRouter } from 'react-router'

import { ListMenu } from 'components/customers/ListMenu/ListMenu'
import { withRouter } from 'next/router'
class ProductsListt extends Component {
  state = {
    pageNumber: 1,
    numberOfPages: '',
    data: [{}],
    group: '',
    subgroup: '',
    isLoading: true
  }

  async componentDidMount() {

    const { group, subgroup, id } = this.props.router.pathname
    console.log(group, subgroup,id)
    await this.setState({
      pageNumber: id,
      group,
      subgroup
    })

    await this.handleGetData(group, subgroup, id)
    this.setState({ isLoading: false })
  }


  async shouldComponentUpdate(nextProps, nextState) {
    const { id, subgroup } = this.props.router.pathname

    if (this.props.router.pathname.id !== nextProps.router.pathname.id || this.props.router.pathname.subgroup !== nextProps.router.pathname.subgroup || this.props.router.pathname.group !== nextProps.router.pathname.group) {


      const subgroup = nextProps.router.pathname.subgroup
      const id = nextProps.router.pathname.id
      const group = nextProps.router.pathname.group
      await this.handleGetData(group, subgroup, id)
      await this.setState({ group: group, pageNumber: id, subgroup: subgroup })
      this.setState({ isLoading: false })
      return true
    }
    else return false
  }


  handleGetData = async (group, subgroup, id = 1) => {
    const limit = 6

    try {
      const { data = [{}], headers } = await getFilteredProducts(group, subgroup, limit, id)
      const totalCount = headers ? headers['x-total-count'] : 1
      const numberOfPages = Math.ceil(totalCount / limit)
      console.log(numberOfPages)
      await this.setState({ data, numberOfPages, pageNumber: id, subgroup: subgroup, group: group })
    }
    catch (error) {
      console.log('get data failed with error ==> ', error.message)
    }
  }

  render() {
    return (
      <div>
        <ListMenu>
          {
            !this.state.isLoading ?
              <CardGroup data={this.state.data}>
                <Paginate numberOfPages={this.state.numberOfPages} clickedPage={async (clickedPage) => await this.setState({ clickedPage })} field={`home/${this.props.match.params.group}`} pathSection={this.props.match.params.subgroup} currentPage={this.props.match.params.id} />
              </CardGroup>
              :
              <section >
                <CardGroup >
                </CardGroup>
                <Spinner />
              </section>
          }
        </ListMenu >
      </div>
    )
  }
}


const ProductsList = withRouter(ProductsListt)
export { ProductsList }
