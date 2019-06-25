import React, { Component } from 'react'
import { Button, Dimmer, Image, Segment } from 'semantic-ui-react'

class DimmerExampleBlurringInverted extends Component {
    state = {}

    handleShow = () => this.setState({ active: true })
    handleHide = () => this.setState({ active: false })

    render() {
        const { active } = this.state

        return (
            <div>
                <Dimmer.Dimmable as={Segment} blurring dimmed={true}>
                    <Dimmer active={true}  onClickOutside={this.handleHide} />


                 
                </Dimmer.Dimmable>

                <Button.Group>
                 
                    <Button icon='minus' onClick={this.handleHide} />
                </Button.Group>
            </div>
        )
    }
}

export default DimmerExampleBlurringInverted;