import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import Image from '@ckeditor/ckeditor5-image/src/image';
import ImageResize from '@ckeditor/ckeditor5-image/src/imageresize';

ClassicEditor
  .create(document.querySelector('#editor'), {
    plugins: [Image, ImageResize, ...ClassicEditor.builtinPlugins],
    toolbar: [...ClassicEditor.defaultConfig.toolbar.items],
    image: {
      toolbar: [ 'imageTextAlternative']
    }
  })
  .catch(error => {
    console.error(error);
  });