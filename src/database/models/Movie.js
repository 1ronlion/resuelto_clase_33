module.exports = (sequelize, dataTypes) => {
    let alias = 'Movie'; // esto debería estar en singular
    let cols = {
        id: {
            type: dataTypes.BIGINT(10).UNSIGNED,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true
        },
        // created_at: dataTypes.TIMESTAMP,
        // updated_at: dataTypes.TIMESTAMP,
        title: {
            type: dataTypes.STRING(500),
            allowNull: false
        },
        rating: {
            type: dataTypes.DECIMAL(3, 1).UNSIGNED,
            allowNull: false
        },
        awards: {
            type: dataTypes.BIGINT(10).UNSIGNED,
            allowNull: false
        },
        release_date: {
            type: dataTypes.DATE,
            allowNull: false
        },
        length: dataTypes.BIGINT(10),
        genre_id: dataTypes.BIGINT(10)
    };
    let config = {
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        deletedAt: false,
        underscored: true
    }
    const Movie = sequelize.define(alias,cols,config);

    Movie.associate = function(models) {

        Movie.belongsTo(models.Genre, {
            
            as: "genre",
            foreingKey: "genre_id"

        })

        Movie.belongsToMany(models.Actor, {

            as: "actors",
            foreingKey: "movie_id",
            otherKey: "actor_id",
            through: "actor_movie",
            timestamps: false

        })


    }   

    return Movie
};