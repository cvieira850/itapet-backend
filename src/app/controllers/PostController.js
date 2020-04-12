import { Op } from 'sequelize';
import * as Yup from 'yup';

import Post from '../models/Post';
import User from '../models/User';

class PostController {
  async index(req, res) {
    const { id, q, page } = req.query;


    if (id) {
      const postExists = await Post.findByPk(id);

      if (!postExists) {
        return res.status(400).json({ error: 'Post not found.' });
      }

      return res.json(postExists);
    }
    if (page) {
      const limit = 3;

      const where = q ? { title: { [Op.iLike]: `%${q}%` } } : {};

      const postsCount = await Post.count({ where });

      const lastPage = page * limit >= postsCount;

      const posts = await Post.findAll({
        where,
        limit,
        offset: (page - 1) * limit,
      });

      return res.json({ lastPage, content: posts });
    }

    const posts = await Post.findAll();


    return res.json(posts);
  }
  async store(req, res) {
    const schema = Yup.object().shape({
      title: Yup.string().required(),
      text: Yup.string()
        .required()
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const loggedUser = await User.findByPk(req.userId);

    if (!loggedUser) {
      return res.status(400).json({ error: 'Invalid token' });
    }
    const postValue = {
      title: req.body.title,
      text: req.body.text,
      user_id: req.userId
    }
    const { id, title, text, user_id, created_at } = await Post.create(postValue);

    return res.json({
      id,
      title,
      text,
      user_id,
      created_at
    });
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      title: Yup.string().required(),
      text: Yup.string()
        .required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const loggedUser = await User.findByPk(req.userId);

    if (!loggedUser) {
      return res.status(400).json({ error: 'Invalid token' });
    }

    const { id } = req.params;

    const postExists = await Post.findByPk(id);

    if (!postExists) {
      return res.status(400).json({ error: 'Post not found.' });
    }

    const post = await postExists.update(req.body);

    return res.json(post);
  }
  async delete(req, res) {
    const { id } = req.params;

    const loggedUser = await User.findByPk(req.userId);

    if (!loggedUser) {
      return res.status(400).json({ error: 'Invalid token' });
    }

    const postExists = await Post.findByPk(id);

    if (!postExists) {
      return res.status(400).json({ error: 'Post not found' });
    }

    await postExists.destroy(id);

    return res.status(204).json();
  }
}

export default new PostController();
