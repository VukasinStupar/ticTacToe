const DataTypes  = require("sequelize");
const sequelize = require("../config/db");
const bcrypt = require('bcryptjs');

const User = sequelize.define("User", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            len: [3, 30]
        }
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            len: [6, 100]
        }
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true
        }
    },
    wins: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    losses: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    draws: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    }

}
// , {
//     hooks: {
//         beforeCreate: async (user) => {
//             user.password = await bcrypt.hash(user.password, 12);
//         }
//     }

// }
);

    console.log('user')
