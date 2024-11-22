      function getRandomColor() {
        const letters = '0123456789ABCDEF';
        let color = '#';
        for (let i = 0; i < 6; i++) {
          color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
      }

      function updateKeyframeColors() {
        const color1 = getRandomColor();
        const color2 = getRandomColor();
        const color3 = getRandomColor();
        const color4 = getRandomColor();

        // Cập nhật biến CSS
        document.documentElement.style.setProperty('--color-1', color1);
        document.documentElement.style.setProperty('--color-2', color2);
        document.documentElement.style.setProperty('--color-3', color3);
        document.documentElement.style.setProperty('--color-4', color4);
      }

      // Gọi hàm để cập nhật màu mỗi 5 giây
      updateKeyframeColors(); // Lần đầu tiên để thiết lập màu ngay
      setInterval(updateKeyframeColors, 5000); // Thay đổi màu mỗi 5 giây