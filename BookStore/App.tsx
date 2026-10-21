
import React, { useState } from 'react';
import {
  View, Text, Image, ScrollView,
  TouchableOpacity, StyleSheet, Alert
} from 'react-native';
import {
  SafeAreaView, SafeAreaProvider
} from 'react-native-safe-area-context';

type Book = {
  id: number;
  name: string;
  author: string;
  price: number;
  category: string;
  image: string;
  sale: string;
};

const books: Book[] = [
  {
    id: 1, name: 'Nhà Giả Kim', author: 'Paulo Coelho',
    price: 79000, category: 'Văn học', sale: '-20%',
    image: 'https://covers.openlibrary.org/b/isbn/9780062315007-M.jpg'
  },
  {
    id: 2, name: 'Đắc Nhân Tâm', author: 'Dale Carnegie',
    price: 86000, category: 'Kỹ năng', sale: '-15%',
    image: 'https://covers.openlibrary.org/b/isbn/9780671027032-M.jpg'
  },
  {
    id: 3, name: 'Harry Potter', author: 'J.K. Rowling',
    price: 150000, category: 'Thiếu nhi', sale: 'Mới',
    image: 'https://covers.openlibrary.org/b/isbn/9780590353427-M.jpg'
  },
  {
    id: 4, name: 'Hoàng Tử Bé', author: 'Antoine',
    price: 65000, category: 'Văn học', sale: '-10%',
    image: 'https://covers.openlibrary.org/b/isbn/9780156012195-M.jpg'
  }
];

const categories = ['Tất cả', 'Văn học', 'Kỹ năng', 'Thiếu nhi'];
const money = (n: number) => n.toLocaleString('vi-VN') + ' đ';

function BookStore() {
  const [page, setPage] = useState('Home');
  const [category, setCategory] = useState('Tất cả');
  const [detail, setDetail] = useState<Book | null>(null);
  const [cart, setCart] = useState<number[]>([1, 2]);
  const [message, setMessage] = useState('');

  const list = category === 'Tất cả'
    ? books
    : books.filter(b => b.category === category);

  const total = cart.reduce((sum, id) => {
    const b = books.find(x => x.id === id);
    return sum + (b ? b.price : 0);
  }, 0);

  const goPage = (p: string) => {
    setDetail(null);
    setPage(p);
    setMessage('');
  };

  const addCart = (id: number) => {
    setCart([...cart, id]);
    setMessage('Đã thêm sách vào giỏ hàng!');
  };

  return (
    <SafeAreaView style={s.container} edges={['top', 'bottom']}>

      {/* GIỜ 1: HEADER */}
      <View style={s.header}>
        <Text style={s.logo}
          onPress={() => detail ? setDetail(null) : goPage('Home')}>
          {detail ? '‹ Chi tiết sách' : '📚 BookStore'}
        </Text>

        <View style={s.icons}>
          <Text style={s.icon} onPress={() => goPage('Danh mục')}>⌕</Text>
          <Text style={s.icon} onPress={() => goPage('Giỏ hàng')}>🛒</Text>
        </View>
      </View>

      <View style={{ flex: 1 }}>

        {/* GIỜ 4: CHI TIẾT SÁCH */}
        {detail ? (
          <>
            <ScrollView contentContainerStyle={{ padding: 16 }}>
              <Image source={{ uri: detail.image }} style={s.detailImage} />

              <Text style={s.title}>{detail.name}</Text>
              <Text>Tác giả: {detail.author}</Text>
              <Text style={s.price}>{money(detail.price)}</Text>

              <Text style={s.title}>Mô tả sách</Text>
              <Text style={{ lineHeight: 25 }}>
                Đây là một cuốn sách hay và ý nghĩa.
                Sách mang đến nhiều kiến thức bổ ích cho người đọc.
                {'\n\n'}
                Nội dung hấp dẫn, phù hợp với nhiều lứa tuổi.
                Giúp người đọc học hỏi và phát triển bản thân.
              </Text>
            </ScrollView>

            <View style={s.bottom}>
              <View>
                <Text style={s.price}>{money(detail.price)}</Text>
                {message !== '' && <Text style={s.success}>{message}</Text>}
              </View>
              <TouchableOpacity style={s.button}
                onPress={() => addCart(detail.id)}>
                <Text style={s.white}>Thêm vào giỏ</Text>
              </TouchableOpacity>
            </View>
          </>
        ) : page === 'Giỏ hàng' ? (

          /* GIỜ 5: GIỎ HÀNG */
          <>
            <ScrollView style={{ flex: 1 }}
              contentContainerStyle={{ padding: 16 }}>
              <Text style={s.title}>Giỏ hàng của bạn</Text>

              {books.filter(b => cart.includes(b.id)).map(b => {
                const qty = cart.filter(id => id === b.id).length;

                return (
                  <View key={b.id} style={s.row}>
                    <Image source={{ uri: b.image }} style={s.smallImage} />
                    <View style={{ flex: 1 }}>
                      <Text style={s.name}>{b.name}</Text>
                      <Text>Số lượng: {qty}</Text>
                      <Text style={s.price}>{money(b.price * qty)}</Text>
                    </View>
                  </View>
                );
              })}
            </ScrollView>

            <View style={s.bottom}>
              <Text style={s.price}>Tổng: {money(total)}</Text>
              <TouchableOpacity style={s.button}
                onPress={() => setMessage('Đây là giao diện demo')}>
                <Text style={s.white}>Thanh toán</Text>
              </TouchableOpacity>
            </View>
            {message !== '' && <Text style={s.success}>{message}</Text>}
          </>
        ) : page === 'Tài khoản' ? (
          <View style={s.center}>
            <Text style={s.title}>👤 Tài khoản</Text>
            <Text>BookStore Online</Text>
          </View>
        ) : (

          /* GIỜ 2, 3, 4: HOME */
          <ScrollView style={{ flex: 1 }}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ padding: 16, paddingBottom: 85 }}>

            <Text style={s.title}>Danh mục sách</Text>

            {/* CATEGORY CHIPS */}
            <View style={s.chips}>
              {categories.map(c => (
                <TouchableOpacity key={c}
                  style={[s.chip, category === c && s.active]}
                  onPress={() => setCategory(c)}>
                  <Text style={{
                    color: category === c ? 'white' : '#3949ab'
                  }}>
                    {c}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={s.title}>Sách nổi bật</Text>

            {/* BOOK GRID 2 CỘT + BADGE */}
            <View style={s.grid}>
              {list.map(b => (
                <TouchableOpacity key={b.id} style={s.book}
                  onPress={() => {
                    setMessage('');
                    setDetail(b);
                  }}>

                  <View style={{ position: 'relative' }}>
                    <Image source={{ uri: b.image }} style={s.bookImage} />
                    <Text style={s.badge}>{b.sale}</Text>
                  </View>

                  <Text style={s.name} numberOfLines={2}>{b.name}</Text>
                  <Text style={s.author}>{b.author}</Text>
                  <Text style={s.price}>{money(b.price)}</Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* GIỜ 1: BOOK CARD NGANG */}
            {page === 'Home' && (
              <>
                <Text style={s.title}>Gợi ý cho bạn</Text>
                {books.map(b => (
                  <TouchableOpacity key={b.id} style={s.row}
                    onPress={() => {
                      setMessage('');
                      setDetail(b);
                    }}>
                    <Image source={{ uri: b.image }} style={s.smallImage} />
                    <View style={s.info}>
                      <View>
                        <Text style={s.name} numberOfLines={2}>{b.name}</Text>
                        <Text>{b.author}</Text>
                      </View>
                      <Text style={s.price}>{money(b.price)}</Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </>
            )}
          </ScrollView>
        )}

        {/* GIỜ 3: FLOATING CART */}
        {!detail && (page === 'Home' || page === 'Danh mục') && (
          <TouchableOpacity style={s.floating}
            onPress={() => goPage('Giỏ hàng')}>
            <Text style={{ fontSize: 25 }}>🛒</Text>
            <Text style={s.count}>{cart.length}</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* GIỜ 5: BOTTOM TAB BAR */}
      <View style={s.tabBar}>
        {[
          ['⌂', 'Home'],
          ['▦', 'Danh mục'],
          ['🛒', 'Giỏ hàng'],
          ['♙', 'Tài khoản']
        ].map(([icon, name]) => (
          <TouchableOpacity key={name} style={s.tab}
            onPress={() => goPage(name)}>
            <Text style={{ fontSize: 22 }}>{icon}</Text>
            <Text style={{
              fontSize: 11,
              color: page === name ? '#3949ab' : '#777'
            }}>
              {name}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

    </SafeAreaView>
  );
}

// BỌC SAFE AREA PROVIDER ĐỂ KHÔNG BỊ LỖI
export default function App() {
  return (
    <SafeAreaProvider>
      <BookStore />
    </SafeAreaProvider>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f6fa' },

  header: {
    height: 56, backgroundColor: '#1e315c',
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', paddingHorizontal: 16
  },
  logo: { color: 'white', fontSize: 20, fontWeight: 'bold' },
  icons: { flexDirection: 'row', gap: 18 },
  icon: { color: 'white', fontSize: 24 },

  title: { fontSize: 19, fontWeight: 'bold', marginVertical: 15 },
  name: { fontSize: 14, fontWeight: 'bold', marginTop: 6 },
  author: { fontSize: 12, color: '#777' },
  price: { color: 'red', fontWeight: 'bold', marginTop: 6 },

  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: {
    borderWidth: 1, borderColor: '#3949ab',
    borderRadius: 20, paddingHorizontal: 14, paddingVertical: 9
  },
  active: { backgroundColor: '#3949ab' },

  grid: {
    flexDirection: 'row', flexWrap: 'wrap',
    justifyContent: 'space-between'
  },
  book: {
    width: '48%', backgroundColor: 'white',
    padding: 10, marginBottom: 12, borderRadius: 8
  },
  bookImage: { width: '100%', aspectRatio: 3 / 4 },
  badge: {
    position: 'absolute', top: 6, left: 6,
    backgroundColor: 'red', color: 'white',
    padding: 5, borderRadius: 5
  },

  row: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: 'white', padding: 10,
    marginBottom: 10, borderRadius: 8, gap: 12
  },
  smallImage: { width: 80, height: 110 },
  info: { flex: 1, justifyContent: 'space-between', height: 110 },

  floating: {
    position: 'absolute', bottom: 20, right: 20,
    width: 60, height: 60, borderRadius: 30,
    backgroundColor: '#536dfe',
    justifyContent: 'center', alignItems: 'center', elevation: 5
  },
  count: {
    position: 'absolute', top: -5, right: -5,
    color: 'white', backgroundColor: 'red',
    paddingHorizontal: 6, borderRadius: 20
  },

  detailImage: {
    width: 200, height: 270, alignSelf: 'center'
  },
  bottom: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', padding: 15, backgroundColor: 'white'
  },
  button: {
    backgroundColor: '#3949ab', padding: 14, borderRadius: 7
  },
  white: { color: 'white', fontWeight: 'bold' },
  success: { color: 'green', fontSize: 11, marginTop: 5 },

  tabBar: {
    height: 60, flexDirection: 'row',
    backgroundColor: 'white', borderTopWidth: 1,
    borderColor: '#ddd'
  },
  tab: {
    flex: 1, justifyContent: 'center', alignItems: 'center'
  },
  center: {
    flex: 1, justifyContent: 'center', alignItems: 'center'
  }
});
