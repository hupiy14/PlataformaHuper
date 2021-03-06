import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';


const styles = {
    card: {
        maxWidth: 345,
    },
    media: {
        height: 140,
    },
};

function MediaCard(props) {
    const { classes } = props;
    return (
        <Card className={classes.card}>
            <CardActionArea>

                <CardMedia
                    className={classes.media}
                    image={props.image}
                    title={`Feeback numero  ${props.id}`}
                />

                <CardContent>
                    <Typography gutterBottom variant="h5" component="h2">
                        Reconstruir
          </Typography>
                    <Typography component="p">
                        Se mas acertivo en tu trabajo, y conoce lo que no sabes.
          </Typography>
                </CardContent>
            </CardActionArea>
            <CardActions>
                <Button size="small" color="primary">
                    Validar
        </Button>
                <Button size="small" color="primary">
                    Contestar
        </Button>
            </CardActions>
        </Card>
    );
}

MediaCard.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(MediaCard);