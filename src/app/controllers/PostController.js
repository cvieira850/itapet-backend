import * as Yup from 'yup';

import Post from '../models/Post';
import User from '../models/User';

class PostController {
  async index(req, res) {
    const { id } = req.query;

    const loggedUser = await User.findByPk(req.userId);

    if (!loggedUser) {
      return res.status(400).json({ error: 'Invalid token' });
    }

    if (id) {
      const postExists = await Post.findByPk(id);

      if (!postExists) {
        return res.status(400).json({ error: 'Post not found.' });
      }

      return res.json(postExists);
    }

    const posts = await Post.findAll();
    console.log(posts);

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
