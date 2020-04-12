import { Op } from 'sequelize';
import * as Yup from 'yup';

import User from '../models/User';

class UserController {
  async index(req, res) {
    const { id } = req.query;

    if (id) {
      const userExists = await User.findByPk(id);

      if (!userExists) {
        return res.status(400).json({ error: 'User not found.' });
      }

      return res.json(userExists);
    }



    const users = await User.findAll();

    return res.json(users);
  }
  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string()
        .email()
        .required(),
      password: Yup.string()
        .required()
        .min(6),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const userExists = await User.findOne({ where: { email: req.body.email } });

    if (userExists) {
      return res.status(400).json({ error: 'Email already registered.' });
    }

    const { id, name, email } = await User.create(req.body);
    return res.json({
      id,
      name,
      email,
    });
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string()
        .email()
        .required(),
      password: Yup.string()
      .min(6)
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const { id } = req.params;

    const userExists = await User.findByPk(id);

    if (!userExists) {
      return res.status(400).json({ error: 'User not found.' });
    }

    const { email } = req.body;

    if (email) {
      const emailAlreadyExists = await User.findOne({
        where: {
          email,
          id: {
            [Op.not]: id,
          },
        },
      });

      if (emailAlreadyExists) {
        return res.status(400).json({ error: 'User already exists.' });
      }
    }

    const user = await userExists.update(req.body);

    return res.json(user);
  }
  async delete(req, res) {
    const { id } = req.params;

    const userExists = await User.findByPk(id);

    if (!userExists) {
      return res.status(400).json({ error: 'User not found' });
    }

    await userExists.destroy(id);

    return res.status(204).json();
  }
}

export default new UserController();
